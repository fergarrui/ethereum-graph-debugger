import { Controller, Route, Query, Post, Body } from 'tsoa'
import { provideSingleton, inject } from '../../../inversify/ioc'
import { TYPES } from '../../../inversify/types'
import { Disassembler } from '../../bytecode/Disassembler'
import { DisassembledContract } from '../../bytecode/DisassembledContract'
import { DisassembledContractResponse } from '../response/DisassembledContractResponse'
import { logger } from '../../../Logger'
import { StringBodyRequest } from '../request/StringBodyRequest';

@Route('disassemble')
@provideSingleton(DisassembleController)
export class DisassembleController extends Controller {
  constructor(@inject(TYPES.Disassembler) private disassembler: Disassembler) {
    super()
  }

  @Post()
  async disassembleSourceCode(
    @Body() source: StringBodyRequest,
    @Query('name') name: string,
    @Query('path') path: string
  ): Promise<DisassembledContractResponse> {
    try {
      const disassembled: DisassembledContract = this.disassembler.disassembleSourceCode(name, source.request, path)
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
