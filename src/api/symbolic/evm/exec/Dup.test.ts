import { createExecutor, createEVMDisassembler } from './TestUtils'
import { EVMExecutor } from '../EVMExecutor'
import { EthereumCFGCreator } from '../../../cfg/EthereumCFGCreator'
import { Disassembler } from '../../../bytecode/Disassembler'
import { OpcodeExecutor } from './OpcodeExecutor'
import { EVMDisassembler } from '../../../bytecode/EVMDisassembler'
import { Word } from '../Word'

describe('Dup', () => {
  let cfgCreator: EthereumCFGCreator
  let disassembler: Disassembler
  let opcodeExecutor: OpcodeExecutor = new OpcodeExecutor()

  beforeEach(() => {
    cfgCreator = new EthereumCFGCreator()
    disassembler = createEVMDisassembler()
  })

  it('Test DUP1', () => {
    const bytecode = '6040604180'
    const executor: EVMExecutor = createExecutor(disassembler, bytecode, cfgCreator, opcodeExecutor)
    executor.run(0)
    expect(executor.evm.stack.get(0)).toEqual(Word.createLiteral('41'))
    expect(executor.evm.stack.get(1)).toEqual(Word.createLiteral('41'))
    expect(executor.evm.stack.get(2)).toEqual(Word.createLiteral('40'))
    expect(executor.evm.stack.length()).toEqual(3)
  })

  it('Test DUP2', () => {
    const bytecode = '6040604181'
    const executor: EVMExecutor = createExecutor(disassembler, bytecode, cfgCreator, opcodeExecutor)
    executor.run(0)
    expect(executor.evm.stack.get(0)).toEqual(Word.createLiteral('40'))
    expect(executor.evm.stack.get(1)).toEqual(Word.createLiteral('41'))
    expect(executor.evm.stack.get(2)).toEqual(Word.createLiteral('40'))
    expect(executor.evm.stack.length()).toEqual(3)
  })

  it('Test DUP3', () => {
    const bytecode = '60036007600082'
    const executor: EVMExecutor = createExecutor(disassembler, bytecode, cfgCreator, opcodeExecutor)
    executor.run(0)
    expect(executor.evm.stack.get(0)).toEqual(Word.createLiteral('03'))
    expect(executor.evm.stack.get(1)).toEqual(Word.createLiteral('00'))
    expect(executor.evm.stack.get(2)).toEqual(Word.createLiteral('07'))
    expect(executor.evm.stack.get(3)).toEqual(Word.createLiteral('03'))
    expect(executor.evm.stack.length()).toEqual(4)
  })

  it('Test DUP15', () => {
    const bytecode = '600160026003600460056006600760086009600a600b600c600d600e600f8e'
    const executor: EVMExecutor = createExecutor(disassembler, bytecode, cfgCreator, opcodeExecutor)
    executor.run(0)
    expect(executor.evm.stack.get(0)).toEqual(Word.createLiteral('01'))
    expect(executor.evm.stack.get(1)).toEqual(Word.createLiteral('0f'))
    expect(executor.evm.stack.get(2)).toEqual(Word.createLiteral('0e'))
    expect(executor.evm.stack.get(15)).toEqual(Word.createLiteral('01'))
    expect(executor.evm.stack.length()).toEqual(16)
  })

  it('Test DUP16', () => {
    const bytecode = '600160026003600460056006600760086009600a600b600c600d600e600f60998f'
    const executor: EVMExecutor = createExecutor(disassembler, bytecode, cfgCreator, opcodeExecutor)
    executor.run(0)
    expect(executor.evm.stack.get(0)).toEqual(Word.createLiteral('01'))
    expect(executor.evm.stack.get(1)).toEqual(Word.createLiteral('99'))
    expect(executor.evm.stack.get(2)).toEqual(Word.createLiteral('0f'))
    expect(executor.evm.stack.get(16)).toEqual(Word.createLiteral('01'))
    expect(executor.evm.stack.length()).toEqual(17)
  })
})
