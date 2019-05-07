import { injectable, inject } from 'inversify'
import { TYPES } from '../../../inversify/types'
import { Disassembler } from '../../bytecode/Disassembler'
import { DisassembledContract } from '../../bytecode/DisassembledContract'
import { CFGContract } from '../bean/CFGContract'
import { CFGCreator } from '../../cfg/CFGCreator'
import { Operation } from '../../bytecode/Operation'
import { EVMExecutor } from '../../symbolic/evm/EVMExecutor'
import { OpcodeExecutor } from '../../symbolic/evm/exec/OpcodeExecutor'
import { CFGBlocks } from '../../cfg/CFGBlocks'
import { logger } from '../../../Logger';
import { DebugTrace } from '../../symbolic/evm/DebugTrace';
import { Opcodes } from '../../bytecode/Opcodes';
import { OperationBlock } from '../../cfg/OperationBlock';
let BN = require('bn.js')

@injectable()
export class CFGService {
  constructor(
    @inject(TYPES.Disassembler) private disassembler: Disassembler,
    @inject(TYPES.CFGCreator) private cfgCreator: CFGCreator,
    @inject(TYPES.OpcodeExecutor) private opExecutor: OpcodeExecutor
  ) {}

  buildCFGFromSource(contractName: string, source: string, path: string): CFGContract {
    let contract: DisassembledContract
    if(source.startsWith('0x')) {
      const cfg: CFGContract = this.buildCFGFromBytecode(source)
      cfg.contractRuntime.rawBytecode = source
      return cfg
    } else {
      contract = this.disassembler.disassembleSourceCode(contractName, source, path)
      return this.buildCfgContract(contract)
    }
  }

  buildCFGFromBytecode(bytecode: string): CFGContract {
    const contract: DisassembledContract = this.disassembler.disassembleContract(bytecode)
    return this.buildCfgContract(contract)
  }

  completeCFGWithTrace(blocks: CFGBlocks, trace: DebugTrace) {
    for (const log of trace.result.structLogs) {
      if (!this.jumpHasBothChildren(log.op, log.pc, blocks)) {
        const block = blocks.get(log.pc)
        this.populateMissingBranch(block, blocks, log.stack, log.op)
      }
    }
  }

  checkTraceLoops(blocks: CFGBlocks, trace: DebugTrace) {
    const logs = trace.result.structLogs
    const count = this.count(logs.map(l => l.pc))
    const repeated: any = Object.keys(count).filter(key => count[key] > 1).map( key=> { return {offset: key, repeated: count[key]}})
    for (const repeatedOffset of repeated) {
      console.log(`trying to find block ${repeatedOffset.offset}`)
      const block = blocks.get(repeatedOffset.offset)
      if (block) {
        console.log('block found')
        block.repeated = repeatedOffset.repeated
      }
    }
  }

  private count(logs): any[] {
    return logs.reduce((a, b) => ({ ...a,
      [b]: (a[b] || 0) + 1
    }), {})
  }

  private populateMissingBranch(block: OperationBlock, blocks: CFGBlocks, stack: string[], op: string) {
    if (op === 'JUMP') {
      const dest = stack[stack.length-1]
      const destOffset = new BN(dest, 16).toNumber()
      block.childA = destOffset
    }
  }

  private jumpHasBothChildren(opcode: string, offset: number, blocks: CFGBlocks): boolean {
    if (!Opcodes.isJumpOp(opcode)) {
      return true
    }
    const block = blocks.get(offset)
    if (!block) {
      return true
    }
    if (opcode === 'JUMPI') {
      if(!block.childA || !block.childB) {
        return false
      } else {
        return true
      }
    }
    if (opcode === 'JUMP') {
      if (block.childA || block.childB) {
        return true
      } else {
        return false
      }
    }
  }

  private buildCfgContract(contract: DisassembledContract): CFGContract {
    const runtimeBlocks = this.calculateCfgBlocks(contract.runtime)
    const cfgContract: CFGContract = {
      contractRuntime: {
        blocks: runtimeBlocks,
        bytecode: contract.runtime,
        rawBytecode: contract.runtimeBytecode
      }
    }
    if (contract.hasConstructor) {
      const constructorBlocks = this.calculateCfgBlocks(contract.constructor)
      cfgContract.contractConstructor = {
        blocks: constructorBlocks,
        bytecode: contract.constructor
      }
    }
    return cfgContract
  }

  private calculateCfgBlocks(ops: Operation[]): CFGBlocks {
    logger.info('Calculating CFG blocks')
    const blocks = this.cfgCreator.divideBlocks(ops)
    const executor = new EVMExecutor(blocks, this.opExecutor)
    executor.run(0)
    logger.info('Calculated dynamic CFG, checking if there are orphan nodes not inspected...')
    executor.runOrphans()
    logger.info(`Orphan blocks analyzed, tried to complete CFG inspecting bytecode`)
    return executor.blocks
  }
}
