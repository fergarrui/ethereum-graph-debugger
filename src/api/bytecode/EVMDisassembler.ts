import { Disassembler } from './Disassembler'
import { Operation } from './Operation'
import { Opcodes } from './Opcodes'
import { injectable } from 'inversify'
import { Opcode } from './Opcode'
import { DisassembledContract } from './DisassembledContract'
import { logger } from '../../Logger';
let BN = require('bn.js')
let solc = require('solc')
let fs = require('fs')
let nodePath = require('path')

@injectable()
export class EVMDisassembler implements Disassembler {
  static readonly metadataPrefix = 'a165627a7a72305820'

  constructor() {}

  disassembleSourceCode(contractName: string, source: string, path: string): DisassembledContract {
    const compileJson = this.generateCompileObject(contractName, source, path)
    const compiledContract = JSON.parse(solc.compileStandardWrapper(JSON.stringify(compileJson)))
    const contractWithExt = `${contractName}.sol`
    const contract = compiledContract.contracts[contractWithExt][contractName]
    if (!contract) {
      throw new Error('Bad source code')
    }
    const bytecode = contract.evm.bytecode.object
    const runtimeBytecode = compiledContract.contracts[contractWithExt][contractName].evm.deployedBytecode.object
    const contractAssembly = compiledContract.contracts[contractWithExt][contractName].evm.legacyAssembly
    if (!contractAssembly) {
      logger.error(JSON.stringify(compiledContract))
      throw new Error(`No code found in contract ${contractName}`)
    }
    const asmRuntime = contractAssembly['.data'][0]['.code'].filter(elem => elem.name !== 'tag')
    const asmConstructor = compiledContract.contracts[contractWithExt][contractName].evm.legacyAssembly['.code'].filter(
      elem => elem.name !== 'tag'
    )
    const disassembledCode: DisassembledContract = this.disassembleContract(bytecode)
    disassembledCode.runtimeBytecode = runtimeBytecode
    return this.populateStartEnd(disassembledCode, asmRuntime, asmConstructor)
  }

  disassembleContract(bytecode: string): DisassembledContract {
    let code = bytecode

    if (bytecode.startsWith('0x')) {
      code = bytecode.slice(2)
    }

    if (code.length % 2 !== 0) {
      throw new Error(`Bad input, bytecode length not even: ${code}`)
    }

    const operations: Operation[] = this.disassembleBytecode(bytecode)
    const hasConstructor = operations.filter(op => op.opcode.name === 'CODECOPY').length > 0
    let constructor = []
    let runtime = operations
    if (hasConstructor) {
      // pre- 0.5.* the opcode we are searching is 'STOP'
      const firstStopIndex = operations.findIndex(op => op.opcode.name === 'INVALID')
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
    let code = bytecode

    if (bytecode.startsWith('0x')) {
      code = bytecode.slice(2)
    }

    if (code.includes(EVMDisassembler.metadataPrefix)) {
      code = code.split(EVMDisassembler.metadataPrefix)[0]
    }

    if (code.length % 2 !== 0) {
      throw new Error(`Bad input, bytecode length not even: ${code}`)
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
    const splittedBytecode: string[] = bytecode.split(EVMDisassembler.metadataPrefix)
    if (splittedBytecode.length < 2) {
      return bytecode
    }
    return splittedBytecode[0]
  }

  private populateStartEnd(disassembledCode: DisassembledContract, asmRuntime, asmConstructor): DisassembledContract {
    const constructor = disassembledCode.constructor
    const runtime = disassembledCode.runtime
    if (constructor.length !== asmConstructor.length + 1 || runtime.length !== asmRuntime.length + 1) {
      console.log(constructor)
      console.log('================')
      console.log(asmConstructor)
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

  private findImports(sources: any, content: string, path: string, filesChecked: string[], initialPath: string) {
    const regexp = /import "(.*)"|import '(.*)'/g
    const match = content.match(regexp)
    if (!match) {
      return
    }
    const matches = match.map(imp => {
      const splittedImp = imp.split('"')
      if (splittedImp.length < 2) {
        return imp.split("'")[1]
      } else {
        return splittedImp[1]
      }
    })

    for (const imp of matches) {
      let importFilePath = path
      if (!importFilePath.endsWith(nodePath.sep)) {
        importFilePath = importFilePath + nodePath.sep
      }
      importFilePath = nodePath.normalize(importFilePath + imp)
      const importPathRelative = nodePath
        .relative(initialPath, importFilePath)
        .replace('./', '')
        .replace('../', '')
        .replace(/^\./, '')

      const importContent = fs.readFileSync(importFilePath).toString()
      let sourceFileName = imp.replace('./', '').replace('../', '')
      if (sourceFileName.startsWith('.')) {
        sourceFileName = sourceFileName.substr(1, sourceFileName.length)
      }
      if (filesChecked.includes(importPathRelative)) {
        continue
      }
      filesChecked.push(importPathRelative)
      sources[importPathRelative] = {
        content: importContent
      }
      this.findImports(
        sources,
        importContent,
        nodePath.normalize(nodePath.dirname(importFilePath)),
        filesChecked,
        initialPath
      )
    }
  }

  private generateCompileObject(contractName: string, content: string, path: string) {
    const sources = {}
    sources[`${contractName}.sol`] = {
      content: content
    }
    const filesChecked = []
    this.findImports(sources, content, path, filesChecked, path)
    const compileJson = {
      language: 'Solidity',
      sources,
      settings: {
        outputSelection: {
          '*': {
            '*': ['evm.bytecode', 'evm.legacyAssembly', 'evm.deployedBytecode']
          }
        }
      }
    }
    return compileJson
  }

  private isPush(opcode: Opcode): boolean {
    return opcode.name.startsWith('PUSH')
  }
}
