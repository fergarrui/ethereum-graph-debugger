import { createExecutor } from './TestUtils'
import { EVMExecutor } from '../EVMExecutor'
import { EthereumCFGCreator } from '../../../cfg/EthereumCFGCreator'
import { Disassembler } from '../../../bytecode/Disassembler'
import { OpcodeExecutor } from './OpcodeExecutor'
import { EVMDisassembler } from '../../../bytecode/EVMDisassembler'
import { Word } from '../Word'

describe('SWAP', () => {
  let cfgCreator: EthereumCFGCreator
  let disassembler: Disassembler
  let opcodeExecutor: OpcodeExecutor = new OpcodeExecutor()

  beforeEach(() => {
    cfgCreator = new EthereumCFGCreator()
    disassembler = new EVMDisassembler()
  })

  it('Test SWAP1', () => {
    const bytecode = '6040604190'
    const executor: EVMExecutor = createExecutor(disassembler, bytecode, cfgCreator, opcodeExecutor)
    executor.run(0)
    expect(executor.evm.stack.get(0)).toEqual(Word.createLiteral('40'))
    expect(executor.evm.stack.get(1)).toEqual(Word.createLiteral('41'))
    expect(executor.evm.stack.length()).toEqual(2)
  })

  it('Test SWAP2', () => {
    const bytecode = '60406041604291'
    const executor: EVMExecutor = createExecutor(disassembler, bytecode, cfgCreator, opcodeExecutor)
    executor.run(0)
    expect(executor.evm.stack.get(0)).toEqual(Word.createLiteral('40'))
    expect(executor.evm.stack.get(1)).toEqual(Word.createLiteral('41'))
    expect(executor.evm.stack.get(2)).toEqual(Word.createLiteral('42'))
    expect(executor.evm.stack.length()).toEqual(3)
  })

  it('Test SWAP3', () => {
    const bytecode = '600360076000609992'
    const executor: EVMExecutor = createExecutor(disassembler, bytecode, cfgCreator, opcodeExecutor)
    executor.run(0)
    expect(executor.evm.stack.get(0)).toEqual(Word.createLiteral('03'))
    expect(executor.evm.stack.get(1)).toEqual(Word.createLiteral('00'))
    expect(executor.evm.stack.get(2)).toEqual(Word.createLiteral('07'))
    expect(executor.evm.stack.get(3)).toEqual(Word.createLiteral('99'))
    expect(executor.evm.stack.length()).toEqual(4)
  })

  it('Test SWAP15', () => {
    const bytecode = '600160026003600460056006600760086009600a600b600c600d600e600f609860999e'
    const executor: EVMExecutor = createExecutor(disassembler, bytecode, cfgCreator, opcodeExecutor)
    executor.run(0)
    expect(executor.evm.stack.get(0)).toEqual(Word.createLiteral('02'))
    expect(executor.evm.stack.get(1)).toEqual(Word.createLiteral('98'))
    expect(executor.evm.stack.get(2)).toEqual(Word.createLiteral('0f'))
    expect(executor.evm.stack.get(15)).toEqual(Word.createLiteral('99'))
    expect(executor.evm.stack.get(16)).toEqual(Word.createLiteral('01'))
    expect(executor.evm.stack.length()).toEqual(17)
  })

  it('Test SWAP16', () => {
    const bytecode = '600160026003600460056006600760086009600a600b600c600d600e600f609860999f'
    const executor: EVMExecutor = createExecutor(disassembler, bytecode, cfgCreator, opcodeExecutor)
    executor.run(0)
    expect(executor.evm.stack.get(0)).toEqual(Word.createLiteral('01'))
    expect(executor.evm.stack.get(1)).toEqual(Word.createLiteral('98'))
    expect(executor.evm.stack.get(2)).toEqual(Word.createLiteral('0f'))
    expect(executor.evm.stack.get(15)).toEqual(Word.createLiteral('02'))
    expect(executor.evm.stack.get(16)).toEqual(Word.createLiteral('99'))
    expect(executor.evm.stack.length()).toEqual(17)
  })
})
