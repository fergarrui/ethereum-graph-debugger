import { createExecutor } from './TestUtils'
import { EVMExecutor } from '../EVMExecutor'
import { EthereumCFGCreator } from '../../../cfg/EthereumCFGCreator'
import { Disassembler } from '../../../bytecode/Disassembler'
import { OpcodeExecutor } from './OpcodeExecutor'
import { EVMDisassembler } from '../../../bytecode/EVMDisassembler'
import { Word } from '../Word'

describe('Push', () => {
  let cfgCreator: EthereumCFGCreator
  let disassembler: Disassembler
  let opcodeExecutor: OpcodeExecutor = new OpcodeExecutor()

  beforeEach(() => {
    cfgCreator = new EthereumCFGCreator()
    disassembler = new EVMDisassembler()
  })

  it('Test PUSH1', () => {
    const bytecode = '60406080'
    const executor: EVMExecutor = createExecutor(disassembler, bytecode, cfgCreator, opcodeExecutor)
    executor.run(0)
    const expectedWord1: Word = Word.createLiteral('40')
    const expectedWord2: Word = Word.createLiteral('80')
    expect(executor.evm.stack.stack).toContainEqual(expectedWord1)
    expect(executor.evm.stack.stack).toContainEqual(expectedWord2)
    expect(executor.evm.stack.length()).toEqual(2)
  })

  it('Test PUSH2', () => {
    const bytecode = '611234'
    const executor: EVMExecutor = createExecutor(disassembler, bytecode, cfgCreator, opcodeExecutor)
    executor.run(0)
    const expectedWord1: Word = Word.createLiteral('1234')
    expect(executor.evm.stack.stack).toContainEqual(expectedWord1)
    expect(executor.evm.stack.length()).toEqual(1)
  })

  it('Test PUSH3', () => {
    const bytecode = '62123456'
    const executor: EVMExecutor = createExecutor(disassembler, bytecode, cfgCreator, opcodeExecutor)
    executor.run(0)
    const expectedWord1: Word = Word.createLiteral('123456')
    expect(executor.evm.stack.stack).toContainEqual(expectedWord1)
    expect(executor.evm.stack.length()).toEqual(1)
  })

  it('Test PUSH3', () => {
    const bytecode = '6312345678'
    const executor: EVMExecutor = createExecutor(disassembler, bytecode, cfgCreator, opcodeExecutor)
    executor.run(0)
    const expectedWord1: Word = Word.createLiteral('12345678')
    expect(executor.evm.stack.stack).toContainEqual(expectedWord1)
    expect(executor.evm.stack.length()).toEqual(1)
  })

  it('Test PUSH4', () => {
    const bytecode = '641234567890'
    const executor: EVMExecutor = createExecutor(disassembler, bytecode, cfgCreator, opcodeExecutor)
    executor.run(0)
    const expectedWord1: Word = Word.createLiteral('1234567890')
    expect(executor.evm.stack.stack).toContainEqual(expectedWord1)
    expect(executor.evm.stack.length()).toEqual(1)
  })

  it('Test PUSH5', () => {
    const bytecode = '65123456789001'
    const executor: EVMExecutor = createExecutor(disassembler, bytecode, cfgCreator, opcodeExecutor)
    executor.run(0)
    const expectedWord1: Word = Word.createLiteral('123456789001')
    expect(executor.evm.stack.stack).toContainEqual(expectedWord1)
    expect(executor.evm.stack.length()).toEqual(1)
  })

  it('Test PUSH6', () => {
    const bytecode = '6612345678900123'
    const executor: EVMExecutor = createExecutor(disassembler, bytecode, cfgCreator, opcodeExecutor)
    executor.run(0)
    const expectedWord1: Word = Word.createLiteral('12345678900123')
    expect(executor.evm.stack.stack).toContainEqual(expectedWord1)
    expect(executor.evm.stack.length()).toEqual(1)
  })

  it('Test PUSH7', () => {
    const bytecode = '671234567890012345'
    const executor: EVMExecutor = createExecutor(disassembler, bytecode, cfgCreator, opcodeExecutor)
    executor.run(0)
    const expectedWord1: Word = Word.createLiteral('1234567890012345')
    expect(executor.evm.stack.stack).toContainEqual(expectedWord1)
    expect(executor.evm.stack.length()).toEqual(1)
  })

  it('Test PUSH8', () => {
    const bytecode = '68123456789001234567'
    const executor: EVMExecutor = createExecutor(disassembler, bytecode, cfgCreator, opcodeExecutor)
    executor.run(0)
    const expectedWord1: Word = Word.createLiteral('123456789001234567')
    expect(executor.evm.stack.stack).toContainEqual(expectedWord1)
    expect(executor.evm.stack.length()).toEqual(1)
  })

  it('Test PUSH9', () => {
    const bytecode = '6912345678900123456789'
    const executor: EVMExecutor = createExecutor(disassembler, bytecode, cfgCreator, opcodeExecutor)
    executor.run(0)
    const expectedWord1: Word = Word.createLiteral('12345678900123456789')
    expect(executor.evm.stack.stack).toContainEqual(expectedWord1)
    expect(executor.evm.stack.length()).toEqual(1)
  })

  it('Test PUSH10', () => {
    const bytecode = '6a1234567890012345678901'
    const executor: EVMExecutor = createExecutor(disassembler, bytecode, cfgCreator, opcodeExecutor)
    executor.run(0)
    const expectedWord1: Word = Word.createLiteral('1234567890012345678901')
    expect(executor.evm.stack.stack).toContainEqual(expectedWord1)
    expect(executor.evm.stack.length()).toEqual(1)
  })

  it('Test PUSH11', () => {
    const bytecode = '6b123456789001234567890123'
    const executor: EVMExecutor = createExecutor(disassembler, bytecode, cfgCreator, opcodeExecutor)
    executor.run(0)
    const expectedWord1: Word = Word.createLiteral('123456789001234567890123')
    expect(executor.evm.stack.stack).toContainEqual(expectedWord1)
    expect(executor.evm.stack.length()).toEqual(1)
  })

  it('Test PUSH32', () => {
    const bytecode = '7fa12b7e68c7bbc4e1f6080c96a7461d449d27e98c31020e4229d8cd8b4942009a'
    const executor: EVMExecutor = createExecutor(disassembler, bytecode, cfgCreator, opcodeExecutor)
    executor.run(0)
    const expectedWord1: Word = Word.createLiteral('a12b7e68c7bbc4e1f6080c96a7461d449d27e98c31020e4229d8cd8b4942009a')
    expect(executor.evm.stack.stack).toContainEqual(expectedWord1)
    expect(executor.evm.stack.length()).toEqual(1)
  })
})
