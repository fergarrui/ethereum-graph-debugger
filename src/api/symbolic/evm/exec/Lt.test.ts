import { createExecutor } from './TestUtils'
import { EVMExecutor } from '../EVMExecutor'
import { EthereumCFGCreator } from '../../../cfg/EthereumCFGCreator'
import { Disassembler } from '../../../bytecode/Disassembler'
import { OpcodeExecutor } from './OpcodeExecutor'
import { EVMDisassembler } from '../../../bytecode/EVMDisassembler'
import { Word } from '../Word'
import { Symbols } from '../Symbols'

describe('LT', () => {
  let cfgCreator: EthereumCFGCreator
  let disassembler: Disassembler
  let opcodeExecutor: OpcodeExecutor = new OpcodeExecutor()

  beforeEach(() => {
    cfgCreator = new EthereumCFGCreator()
    disassembler = new EVMDisassembler()
  })

  it('Test LT true', () => {
    const bytecode = '6002600110'
    const executor: EVMExecutor = createExecutor(disassembler, bytecode, cfgCreator, opcodeExecutor)
    executor.run(0)
    expect(executor.evm.stack.get(0)).toEqual(Word.createLiteral('01'))
    expect(executor.evm.stack.length()).toEqual(1)
  })

  it('Test LT false', () => {
    const bytecode = '6001600210'
    const executor: EVMExecutor = createExecutor(disassembler, bytecode, cfgCreator, opcodeExecutor)
    executor.run(0)
    expect(executor.evm.stack.get(0)).toEqual(Word.createLiteral('00'))
    expect(executor.evm.stack.length()).toEqual(1)
  })

  it('Test LT false - equals', () => {
    const bytecode = '6001600110'
    const executor: EVMExecutor = createExecutor(disassembler, bytecode, cfgCreator, opcodeExecutor)
    executor.run(0)
    expect(executor.evm.stack.get(0)).toEqual(Word.createLiteral('00'))
    expect(executor.evm.stack.length()).toEqual(1)
  })

  it('Test LT Symbolic', () => {
    const bytecode = '60203410'
    const executor: EVMExecutor = createExecutor(disassembler, bytecode, cfgCreator, opcodeExecutor)
    executor.run(0)
    expect(executor.evm.stack.get(0)).toEqual(Word.createSymbolic(Symbols.UNKNOWN))
    expect(executor.evm.stack.length()).toEqual(1)
  })
})
