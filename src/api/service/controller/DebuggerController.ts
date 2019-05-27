import { Route, Controller, Query, Path, Body, Post } from 'tsoa'
import { provideSingleton, inject } from '../../../inversify/ioc'
import { TYPES } from '../../../inversify/types'
import { CFGService } from '../service/CFGService'
import { GraphVizService } from '../../cfg/GraphVizService'
import { CFGContract } from '../bean/CFGContract'
import { TransactionService } from '../service/TransactionService'
import { DebugTrace } from '../../symbolic/evm/DebugTrace'
import { OperationResponse } from '../response/OperationResponse'
import { TraceResponse } from '../response/TraceResponse'
import { logger } from '../../../Logger'
import { Web3Configuration } from 'src/api/blockchain/Web3Configuration';
import { StringBodyRequest } from '../request/StringBodyRequest';

@Route('debug')
@provideSingleton(DebuggerController)
export class DebuggerController extends Controller {
  constructor(
    @inject(TYPES.CFGService) private cfgService: CFGService,
    @inject(TYPES.GraphVizService) private graphVizService: GraphVizService,
    @inject(TYPES.TransactionService) private transactionService: TransactionService
  ) {
    super()
  }

  @Post('{tx}')
  async debug(
    @Path() tx: string,
    @Body() source: StringBodyRequest,
    @Query('name') name: string,
    @Query('path') path: string,
    @Query('blockchainHost') blockchainHost?: string,
    @Query('blockchainProtocol') blockchainProtocol?: string,
    @Query('blockchainBasicAuthUsername') blockchainBasicAuthUsername?: string,
    @Query('blockchainBasicAuthPassword') blockchainBasicAuthPassword?: string
  ): Promise<TraceResponse> {
    // TODO: Do detect constructor
    try {
      const config = {
        blockchainHost,
        blockchainProtocol,
        blockchainBasicAuthUsername,
        blockchainBasicAuthPassword
      } as Web3Configuration
      const contractBlocks: CFGContract = await this.cfgService.buildCFGFromSource(name, source.request, path)
      const transaction = await this.transactionService.findTransaction(tx, config)
      const isConstructor = transaction.to? false: true
      let rawBytecode = contractBlocks.contractRuntime.rawBytecode.startsWith('0x')? contractBlocks.contractRuntime.rawBytecode: `0x${contractBlocks.contractRuntime.rawBytecode}`
      if (isConstructor) {
        rawBytecode = contractBlocks.contractConstructor.rawBytecode.startsWith('0x')?  contractBlocks.contractConstructor.rawBytecode: `0x${ contractBlocks.contractConstructor.rawBytecode}`
      }
      const trace: DebugTrace = await this.transactionService.findTransactionTrace(tx, rawBytecode, config)
      const cfg = this.createCFG(contractBlocks, isConstructor, trace)
      return this.buildResponse(contractBlocks, isConstructor, cfg, trace)
    } catch (err) {
      logger.error(err)
      throw new Error(err.message)
    }
  }

  private createCFG(contractBlocks: CFGContract, constructor: boolean, trace: DebugTrace): string {
    let blocks = contractBlocks.contractRuntime.blocks
    if (constructor) {
      blocks = contractBlocks.contractConstructor.blocks
    }
    this.cfgService.completeCFGWithTrace(blocks, trace)
    this.cfgService.checkTraceLoops(blocks, trace)
    return this.graphVizService.createDotFromBlocks(blocks, trace)
  }

  private buildResponse(
    contractBlocks: CFGContract,
    constructor: boolean,
    cfg: string,
    trace: DebugTrace
  ): TraceResponse {
    let opResponse: OperationResponse[] = contractBlocks.contractRuntime.bytecode.map(op => {
      return {
        offset: op.offset,
        opcode: op.opcode,
        argument: op.argument.toString(16),
        begin: op.begin,
        end: op.end
      }
    })
    if (constructor) {
      opResponse = contractBlocks.contractConstructor.bytecode.map(op => {
        return {
          offset: op.offset,
          opcode: op.opcode,
          argument: op.argument.toString(16),
          begin: op.begin,
          end: op.end
        }
      })
    }
    return {
      cfg: cfg,
      operations: opResponse,
      trace: this.groupTrace(trace)
    }
  }

  private groupTrace(trace: DebugTrace): any {
    const result = {}
    for (const log of trace.result.structLogs) {
      if (!result[log.pc]) {
        result[log.pc] = []
      }
      result[log.pc].push(log)
    }
    return result
  }
}
