import { EthereumCFGCreator } from './EthereumCFGCreator'
import { Disassembler } from '../bytecode/Disassembler'
import { OpcodeExecutor } from '../symbolic/evm/exec/OpcodeExecutor'
import { EVMDisassembler } from '../bytecode/EVMDisassembler'
import { EVMExecutor } from '../symbolic/evm/EVMExecutor'
import { createExecutor } from '../symbolic/evm/exec/TestUtils'
import { GraphVizService } from './GraphVizService'

describe('GraphVizService', () => {
  let cfgCreator: EthereumCFGCreator
  let disassembler: Disassembler
  let opcodeExecutor: OpcodeExecutor = new OpcodeExecutor()
  let graph: GraphVizService

  beforeEach(() => {
    cfgCreator = new EthereumCFGCreator()
    disassembler = new EVMDisassembler()
    graph = new GraphVizService()
  })

  it('Create simple DOT string', () => {
    const bytecode =
      '608060405260043610603f576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063e2179b8e146044575b600080fd5b348015604f57600080fd5b5060566058565b005b5600a165627a7a723058202b2566218088bf32ca5a2f029f04a425067ebe1770872a7b06934044a63a81630029'
    const executor: EVMExecutor = createExecutor(disassembler, bytecode, cfgCreator, opcodeExecutor)
    executor.run(0)
    const blocks = executor.blocks
    const dotString = graph.createDotFromBlocks(blocks, undefined)
  })
})
