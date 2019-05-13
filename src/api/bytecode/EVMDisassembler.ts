import { Disassembler } from './Disassembler'
import { Operation } from './Operation'
import { Opcodes } from './Opcodes'
import { injectable, inject } from 'inversify'
import { Opcode } from './Opcode'
import { DisassembledContract } from './DisassembledContract'
import { logger } from '../../Logger';
import { TYPES } from '../../inversify/types';
import { ContractService } from '../service/service/ContractService';
import { Solc } from '../service/service/Solc';
let BN = require('bn.js')


@injectable()
export class EVMDisassembler implements Disassembler {
  static readonly metadataPrefix = 'a165627a7a72305820'

  constructor(
    @inject(TYPES.ContractService) private contractService: ContractService,
    @inject(TYPES.Solc) private solc: Solc
  ) {}

  disassembleSourceCode(contractName: string, source: string, path: string): DisassembledContract {
    if (source.startsWith('0x')) {
      return this.disassembleContract(source)
    }
    
    const contract = this.contractService.compileContract(contractName, source, path)


    const bytecode = contract.evm.bytecode.object
    const runtimeBytecode = contract.evm.deployedBytecode.object
    const contractAssembly = contract.evm.legacyAssembly
    if (!contractAssembly) {
      logger.error(JSON.stringify(contract))
      throw new Error(`No code found in contract ${contractName}`)
    }
    const asmRuntime = contractAssembly['.data'][0]['.code'].filter(elem => elem.name !== 'tag')
    const asmConstructor = contract.evm.legacyAssembly['.code'].filter(
      elem => elem.name !== 'tag'
    )
    const disassembledCode: DisassembledContract = this.disassembleContract(bytecode)
    disassembledCode.runtimeBytecode = runtimeBytecode
    return this.populateStartEnd(disassembledCode, asmRuntime, asmConstructor)
  }

  disassembleContract(bytecode: string): DisassembledContract {
    let code = bytecode.trim()

    if (bytecode.startsWith('0x')) {
      code = bytecode.slice(2)
    }

    if (code.includes(EVMDisassembler.metadataPrefix)) {
      code = code.split(EVMDisassembler.metadataPrefix)[0]
    }

    code = code.length % 2 !== 0 ? code.substr(0, code.length-1): code
    if (code.length % 2 !== 0) {
      throw new Error(`disassembleContract - Bad input, bytecode length not even: ${code}, length: ${code.length}`)
    }

    const operations: Operation[] = this.disassembleBytecode(bytecode)
    const hasConstructor = operations.filter(op => op.opcode.name === 'CODECOPY').length > 0
    let constructor = []
    let runtime = operations
    if (hasConstructor) {
      let splitOpcode = 'STOP'
      if (this.solc.isVersion5OrAbove()) {
        splitOpcode = 'INVALID'
      }
      const firstStopIndex = operations.findIndex(op => op.opcode.name === splitOpcode)
      constructor = operations.slice(0, firstStopIndex + 1)
      runtime = this.adjustRuntimeOffset(operations.slice(firstStopIndex + 1, operations.length))
    }
    return {
      bytecode: bytecode,
      hasConstructor: hasConstructor,
      runtime: runtime,
      constructor: constructor
    } as DisassembledContract
  }

  disassembleBytecode(bytecode: string): Operation[] {
    let code = bytecode.trim()

    if (bytecode.startsWith('0x')) {
      code = bytecode.slice(2)
    }

    if (code.includes(EVMDisassembler.metadataPrefix)) {
      code = code.split(EVMDisassembler.metadataPrefix)[0]
    }
    code = code.length % 2 !== 0 ? code.substr(0, code.length-1): code
    if (code.length % 2 !== 0) {
      throw new Error(`disassembleBytecode - Bad input, bytecode length not even: ${code}, length: ${code.length}`)
    }
    let offset = 0
    const operations = code.match(/.{1,2}/g)
    const disassembledOperations: Operation[] = []

    for (let i = 0; i < operations.length; i++) {
      const code = operations[i]
      const opcode: Opcode = Opcodes.opcodes[parseInt(code, 16)] || Opcodes.opcodes[-1]
      if (this.isPush(opcode)) {
        const parameters = opcode.parameters
        const argument = `${operations.slice(i + 1, i + parameters + 1).join('')}`
        const operation = this.createOperation(offset, opcode, argument)
        disassembledOperations.push(operation)
        offset = offset + 1 + parameters
        i = i + parameters
      } else {
        const operation = this.createOperation(offset, opcode, '0')
        disassembledOperations.push(operation)
        offset++
      }
    }
    return disassembledOperations
  }

  static removeMetadata(bytecode: string): string {
    let splittedBytecode: string[] = bytecode.split(EVMDisassembler.metadataPrefix)
    if (splittedBytecode.length < 2) {
      splittedBytecode = bytecode.split(EVMDisassembler.metadataPrefix.toUpperCase())
    }
    if (splittedBytecode.length < 2) {
      return bytecode
    }
    return splittedBytecode[0]
  }

  private populateStartEnd(disassembledCode: DisassembledContract, asmRuntime, asmConstructor): DisassembledContract {
    const constructor = disassembledCode.constructor
    const runtime = disassembledCode.runtime
    if (constructor.length !== asmConstructor.length + 1 || runtime.length !== asmRuntime.length + 1) {
      logger.error(`Source mappings do not match with bytecode, constructorLength=${constructor.length}, asmConstructorLength=${asmConstructor.length}, runtimeLength=${runtime.length}, asmRuntimeLength=${asmRuntime.length}`)
      throw new Error(`Source mappings do not match with bytecode`)
    }

    if (disassembledCode.hasConstructor) {
      for (let i = 0; i < asmConstructor.length; i++) {
        const op = asmConstructor[i]
        constructor[i].begin = op.begin
        constructor[i].end = op.end
      }
    }

    for (let i = 0; i < asmRuntime.length; i++) {
      const op = asmRuntime[i]
      runtime[i].begin = op.begin
      runtime[i].end = op.end
    }

    return disassembledCode
  }

  private adjustRuntimeOffset(operations: Operation[]) {
    const firstOffset = operations[0].offset
    operations.forEach(op => (op.offset = op.offset - firstOffset))
    return operations
  }

  private createOperation(offset: number, opcode: Opcode, argument: string) {
    return {
      offset: offset,
      opcode: opcode,
      argument: new BN(argument, 16)
    } as Operation
  }



  private isPush(opcode: Opcode): boolean {
    return opcode.name.startsWith('PUSH')
  }
}
