import { createExecutor } from './TestUtils'
import { EVMExecutor } from '../EVMExecutor'
import { EthereumCFGCreator } from '../../../cfg/EthereumCFGCreator'
import { Disassembler } from '../../../bytecode/Disassembler'
import { OpcodeExecutor } from './OpcodeExecutor'
import { EVMDisassembler } from '../../../bytecode/EVMDisassembler'
import { Word } from '../Word'

describe('MLoad', () => {
  let cfgCreator: EthereumCFGCreator
  let disassembler: Disassembler
  let opcodeExecutor: OpcodeExecutor = new OpcodeExecutor()

  beforeEach(() => {
    cfgCreator = new EthereumCFGCreator()
    disassembler = new EVMDisassembler()
  })

  it('Test MLoad from 0', () => {
    const bytecode = '6080600052600051'
    const executor: EVMExecutor = createExecutor(disassembler, bytecode, cfgCreator, opcodeExecutor)
    executor.run(0)
    expect(executor.evm.stack.length()).toEqual(1)
    expect(executor.evm.stack.get(0)).toEqual(
      Word.createLiteral('0000000000000000000000000000000000000000000000000000000000000080')
    )
  })

  it('Test MLoad from arbitrary offset', () => {
    const bytecode = '6080602052602051'
    const executor: EVMExecutor = createExecutor(disassembler, bytecode, cfgCreator, opcodeExecutor)
    executor.run(0)
    expect(executor.evm.stack.length()).toEqual(1)
    expect(executor.evm.stack.get(0)).toEqual(
      Word.createLiteral('0000000000000000000000000000000000000000000000000000000000000080')
    )
  })
})
