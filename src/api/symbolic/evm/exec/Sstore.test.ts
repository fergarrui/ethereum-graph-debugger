import { createExecutor, createEVMDisassembler } from './TestUtils'
import { EVMExecutor } from '../EVMExecutor'
import { EthereumCFGCreator } from '../../../cfg/EthereumCFGCreator'
import { Disassembler } from '../../../bytecode/Disassembler'
import { OpcodeExecutor } from './OpcodeExecutor'
import { EVMDisassembler } from '../../../bytecode/EVMDisassembler'
import { Word } from '../Word'
import { Symbols } from '../Symbols'

describe('Sstore', () => {
  let cfgCreator: EthereumCFGCreator
  let disassembler: Disassembler
  let opcodeExecutor: OpcodeExecutor = new OpcodeExecutor()

  beforeEach(() => {
    cfgCreator = new EthereumCFGCreator()
    disassembler = createEVMDisassembler()
  })

  it('Test Sstore', () => {
    const bytecode = '6020600155'
    const executor: EVMExecutor = createExecutor(disassembler, bytecode, cfgCreator, opcodeExecutor)
    executor.run(0)
    expect(Object.keys(executor.evm.storage.storage).length).toEqual(1)
    expect(Object.keys(executor.evm.storage.storage)[0]).toEqual('1')
    expect(executor.evm.storage.load(Word.createLiteral('01'))).toEqual(Word.createLiteral('20'))
    expect(executor.evm.stack.length()).toEqual(0)
  })

  it('Test Sstore overwrite', () => {
    const bytecode = '60206001556021600155'
    const executor: EVMExecutor = createExecutor(disassembler, bytecode, cfgCreator, opcodeExecutor)
    executor.run(0)
    expect(Object.keys(executor.evm.storage.storage).length).toEqual(1)
    expect(Object.keys(executor.evm.storage.storage)[0]).toEqual('1')
    expect(executor.evm.storage.load(Word.createLiteral('01'))).toEqual(Word.createLiteral('21'))
    expect(executor.evm.stack.length()).toEqual(0)
  })

  it('Test Sstore Symbol slot', () => {
    const bytecode = '60203455'
    const executor: EVMExecutor = createExecutor(disassembler, bytecode, cfgCreator, opcodeExecutor)
    executor.run(0)
    expect(Object.keys(executor.evm.storage.storage).length).toEqual(1)
    expect(Object.keys(executor.evm.storage.storage)[0]).toEqual('CALLVALUE')
    expect(executor.evm.storage.load(Word.createSymbolic(Symbols.CALLVALUE))).toEqual(Word.createLiteral('20'))
    expect(executor.evm.stack.length()).toEqual(0)
  })

  it('Test Sstore Symbol value', () => {
    const bytecode = '34602055'
    const executor: EVMExecutor = createExecutor(disassembler, bytecode, cfgCreator, opcodeExecutor)
    executor.run(0)
    expect(Object.keys(executor.evm.storage.storage).length).toEqual(1)
    // 32 dec == 0x20
    expect(Object.keys(executor.evm.storage.storage)[0]).toEqual('32')
    expect(executor.evm.storage.load(Word.createLiteral('20'))).toEqual(Word.createSymbolic(Symbols.CALLVALUE))
    expect(executor.evm.stack.length()).toEqual(0)
  })
})
