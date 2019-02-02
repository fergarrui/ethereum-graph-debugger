import { createExecutor } from './TestUtils'
import { EVMExecutor } from '../EVMExecutor'
import { EthereumCFGCreator } from '../../../cfg/EthereumCFGCreator'
import { Disassembler } from '../../../bytecode/Disassembler'
import { OpcodeExecutor } from './OpcodeExecutor'
import { EVMDisassembler } from '../../../bytecode/EVMDisassembler'
import { Word } from '../Word'

describe('Signextend', () => {
  let cfgCreator: EthereumCFGCreator
  let disassembler: Disassembler
  let opcodeExecutor: OpcodeExecutor = new OpcodeExecutor()

  beforeEach(() => {
    cfgCreator = new EthereumCFGCreator()
    disassembler = new EVMDisassembler()
  })

  it('Test Signextend 1', () => {
    const bytecode = '60f260000b'
    const executor: EVMExecutor = createExecutor(disassembler, bytecode, cfgCreator, opcodeExecutor)
    executor.run(0)
    expect(executor.evm.stack.get(0)).toEqual(
      Word.createLiteral('fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff2')
    )
    expect(executor.evm.stack.length()).toEqual(1)
  })

  it('Test Signextend 2', () => {
    const bytecode = '60f260010b'
    const executor: EVMExecutor = createExecutor(disassembler, bytecode, cfgCreator, opcodeExecutor)
    executor.run(0)
    expect(executor.evm.stack.get(0)).toEqual(Word.createLiteral('f2'))
    expect(executor.evm.stack.length()).toEqual(1)
  })

  it('Test Signextend 3', () => {
    const bytecode = '620f00ab60010b'
    const executor: EVMExecutor = createExecutor(disassembler, bytecode, cfgCreator, opcodeExecutor)
    executor.run(0)
    expect(executor.evm.stack.get(0)).toEqual(Word.createLiteral('ab'))
    expect(executor.evm.stack.length()).toEqual(1)
  })

  it('Test Signextend 4', () => {
    const bytecode = '61ffff60010b'
    const executor: EVMExecutor = createExecutor(disassembler, bytecode, cfgCreator, opcodeExecutor)
    executor.run(0)
    expect(executor.evm.stack.get(0)).toEqual(
      Word.createLiteral('ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
    )
    expect(executor.evm.stack.length()).toEqual(1)
  })

  it('Test Signextend 5', () => {
    const bytecode = '63ffffffff60030b'
    const executor: EVMExecutor = createExecutor(disassembler, bytecode, cfgCreator, opcodeExecutor)
    executor.run(0)
    expect(executor.evm.stack.get(0)).toEqual(
      Word.createLiteral('ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
    )
    expect(executor.evm.stack.length()).toEqual(1)
  })

  it('Test Signextend 6', () => {
    const bytecode = '64ab0234567860030b'
    const executor: EVMExecutor = createExecutor(disassembler, bytecode, cfgCreator, opcodeExecutor)
    executor.run(0)
    expect(executor.evm.stack.get(0)).toEqual(Word.createLiteral('02345678'))
    expect(executor.evm.stack.length()).toEqual(1)
  })

  it('Test Signextend 7', () => {
    const bytecode = '64ab8234567860030b'
    const executor: EVMExecutor = createExecutor(disassembler, bytecode, cfgCreator, opcodeExecutor)
    executor.run(0)
    expect(executor.evm.stack.get(0)).toEqual(
      Word.createLiteral('ffffffffffffffffffffffffffffffffffffffffffffffffffffffff82345678')
    )
    expect(executor.evm.stack.length()).toEqual(1)
  })
})
