import { Controller, Route, Get, Query } from 'tsoa'
import { provideSingleton, inject } from '../../../inversify/ioc'
import { TYPES } from '../../../inversify/types'
import { Disassembler } from '../../bytecode/Disassembler'
import { DisassembledContract } from '../../bytecode/DisassembledContract'
import { DisassembledContractResponse } from '../response/DisassembledContractResponse'
import { logger } from '../../../Logger'

@Route('disassemble')
@provideSingleton(DisassembleController)
export class DisassembleController extends Controller {
  constructor(@inject(TYPES.Disassembler) private disassembler: Disassembler) {
    super()
  }

  @Get()
  async disassembleSourceCode(
    @Query('source') source: string,
    @Query('name') name: string,
    @Query('path') path: string
  ): Promise<DisassembledContractResponse> {
    try {
      const disassembled: DisassembledContract = this.disassembler.disassembleSourceCode(name, source, path)
      return this.contractToResponse(disassembled)
    } catch (err) {
      logger.error(err)
      throw new Error(err.message)
    }
  }

  private contractToResponse(disassembled: DisassembledContract): DisassembledContractResponse {
    return {
      bytecode: disassembled.bytecode,
      hasConstructor: disassembled.hasConstructor,
      constructorOperations: disassembled.constructor.map(op => {
        return {
          offset: op.offset,
          opcode: op.opcode,
          argument: op.argument.toString(16)
        }
      }),
      runtimeOperations: disassembled.runtime.map(op => {
        return {
          offset: op.offset,
          opcode: op.opcode,
          argument: op.argument.toString(16)
        }
      })
    } as DisassembledContractResponse
  }
}
