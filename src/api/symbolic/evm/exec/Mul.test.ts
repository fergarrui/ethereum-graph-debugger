import { createExecutor, createEVMDisassembler } from './TestUtils'
import { EVMExecutor } from '../EVMExecutor'
import { EthereumCFGCreator } from '../../../cfg/EthereumCFGCreator'
import { Disassembler } from '../../../bytecode/Disassembler'
import { OpcodeExecutor } from './OpcodeExecutor'
import { EVMDisassembler } from '../../../bytecode/EVMDisassembler'
import { Word } from '../Word'
import { Symbols } from '../Symbols'

describe('Mul', () => {
  let cfgCreator: EthereumCFGCreator
  let disassembler: Disassembler
  let opcodeExecutor: OpcodeExecutor = new OpcodeExecutor()

  beforeEach(() => {
    cfgCreator = new EthereumCFGCreator()
    disassembler = createEVMDisassembler()
  })

  it('Test Mul', () => {
    const bytecode = '6002600302'
    const executor: EVMExecutor = createExecutor(disassembler, bytecode, cfgCreator, opcodeExecutor)
    executor.run(0)
    expect(executor.evm.stack.get(0)).toEqual(Word.createLiteral('06'))
    expect(executor.evm.stack.length()).toEqual(1)
  })

  it('Test Mul 2', () => {
    const bytecode = '6003600202'
    const executor: EVMExecutor = createExecutor(disassembler, bytecode, cfgCreator, opcodeExecutor)
    executor.run(0)
    expect(executor.evm.stack.get(0)).toEqual(Word.createLiteral('06'))
    expect(executor.evm.stack.length()).toEqual(1)
  })

  it('Test Mul 3', () => {
    const bytecode = '6000600302'
    const executor: EVMExecutor = createExecutor(disassembler, bytecode, cfgCreator, opcodeExecutor)
    executor.run(0)
    expect(executor.evm.stack.get(0)).toEqual(Word.createLiteral('00'))
    expect(executor.evm.stack.length()).toEqual(1)
  })

  it('Test Mul overflow', () => {
    const bytecode = '7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff600202'
    const executor: EVMExecutor = createExecutor(disassembler, bytecode, cfgCreator, opcodeExecutor)
    executor.run(0)
    expect(executor.evm.stack.get(0)).toEqual(
      Word.createLiteral('fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe')
    )
    expect(executor.evm.stack.length()).toEqual(1)
  })

  it('Test Mul overflow 2', () => {
    const bytecode = '7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff600302'
    const executor: EVMExecutor = createExecutor(disassembler, bytecode, cfgCreator, opcodeExecutor)
    executor.run(0)
    expect(executor.evm.stack.get(0)).toEqual(
      Word.createLiteral('fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd')
    )
    expect(executor.evm.stack.length()).toEqual(1)
  })

  it('Test Mul overflow 3', () => {
    const bytecode = '7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8002'
    const executor: EVMExecutor = createExecutor(disassembler, bytecode, cfgCreator, opcodeExecutor)
    executor.run(0)
    expect(executor.evm.stack.get(0)).toEqual(Word.createLiteral('01'))
    expect(executor.evm.stack.length()).toEqual(1)
  })

  it('Test Mul Symbolic', () => {
    const bytecode = '60203402'
    const executor: EVMExecutor = createExecutor(disassembler, bytecode, cfgCreator, opcodeExecutor)
    executor.run(0)
    expect(executor.evm.stack.get(0)).toEqual(Word.createSymbolic(Symbols.UNKNOWN))
    expect(executor.evm.stack.length()).toEqual(1)
  })
})
