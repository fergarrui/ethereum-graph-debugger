import { createExecutor, createEVMDisassembler } from './TestUtils'
import { EVMExecutor } from '../EVMExecutor'
import { EthereumCFGCreator } from '../../../cfg/EthereumCFGCreator'
import { Disassembler } from '../../../bytecode/Disassembler'
import { OpcodeExecutor } from './OpcodeExecutor'
import { EVMDisassembler } from '../../../bytecode/EVMDisassembler'
import { Word } from '../Word'
import { Symbols } from '../Symbols'

describe('Sha3', () => {
  let cfgCreator: EthereumCFGCreator
  let disassembler: Disassembler
  let opcodeExecutor: OpcodeExecutor = new OpcodeExecutor()

  beforeEach(() => {
    cfgCreator = new EthereumCFGCreator()
    disassembler = createEVMDisassembler()
  })

  it('Test Sha3', () => {
    const bytecode = '60016000536001600020'
    const executor: EVMExecutor = createExecutor(disassembler, bytecode, cfgCreator, opcodeExecutor)
    executor.run(0)
    expect(executor.evm.stack.get(0)).toEqual(
      Word.createLiteral('5FE7F977E71DBA2EA1A68E21057BEEBB9BE2AC30C6410AA38D4F3FBE41DCFFD2')
    )
    expect(executor.evm.stack.length()).toEqual(1)
  })

  it('Test Sha3 2', () => {
    const bytecode = '60806040526020602020'
    const executor: EVMExecutor = createExecutor(disassembler, bytecode, cfgCreator, opcodeExecutor)
    executor.run(0)
    expect(executor.evm.stack.get(0)).toEqual(
      Word.createLiteral('290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563')
    )
    expect(executor.evm.stack.length()).toEqual(1)
  })

  it('Test Sha3 3', () => {
    const bytecode = '60806040526020604020'
    const executor: EVMExecutor = createExecutor(disassembler, bytecode, cfgCreator, opcodeExecutor)
    executor.run(0)
    expect(executor.evm.stack.get(0)).toEqual(
      Word.createLiteral('59f3fb058c6bba7a4e76396639fc4dd21bd59163db798899cf56cef48b3c9ec9')
    )
    expect(executor.evm.stack.length()).toEqual(1)
  })

  it('Test Sha3 Symbolic', () => {
    const bytecode = '60203420'
    const executor: EVMExecutor = createExecutor(disassembler, bytecode, cfgCreator, opcodeExecutor)
    executor.run(0)
    expect(executor.evm.stack.get(0)).toEqual(Word.createSymbolic(Symbols.UNKNOWN))
    expect(executor.evm.stack.length()).toEqual(1)
  })
})
