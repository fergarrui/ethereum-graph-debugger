import 'reflect-metadata'
import { EVMExecutor } from './EVMExecutor'
import { EthereumCFGCreator } from '../../cfg/EthereumCFGCreator'
import { Disassembler } from '../../bytecode/Disassembler'
import { EVMDisassembler } from '../../bytecode/EVMDisassembler'
import { OpcodeExecutor } from './exec/OpcodeExecutor'
import { Word } from './Word'
import { createExecutor } from './exec/TestUtils'
import { DisassembledContract } from '../../bytecode/DisassembledContract'

describe('EVMExecutor', () => {
  let cfgCreator: EthereumCFGCreator
  let disassembler: Disassembler
  let opcodeExecutor: OpcodeExecutor = new OpcodeExecutor()

  beforeEach(() => {
    cfgCreator = new EthereumCFGCreator()
    disassembler = new EVMDisassembler()
  })

  it('Test simple PUSH execution', () => {
    const bytecode = '60406080'
    const executor: EVMExecutor = createExecutor(disassembler, bytecode, cfgCreator, opcodeExecutor)
    executor.run(0)
    const expectedWord1: Word = Word.createLiteral('40')
    const expectedWord2: Word = Word.createLiteral('80')
    expect(executor.evm.stack.stack).toContainEqual(expectedWord1)
    expect(executor.evm.stack.stack).toContainEqual(expectedWord2)
    expect(executor.evm.stack.length()).toEqual(2)
    expect(executor.blocks.length()).toEqual(1)
    expect(executor.blocks.keys()).toEqual([0])
    expect(executor.blocks.get(0).childA).toBeUndefined()
    expect(executor.blocks.get(0).childB).toBeUndefined()
  })

  it('Test block with JUMPI', () => {
    const bytecode = '6080604052348015600f57600080fd5b5060868061001e6000396000f3'
    const executor: EVMExecutor = createExecutor(disassembler, bytecode, cfgCreator, opcodeExecutor)
    executor.run(0)
    const block0 = executor.blocks.get(0x0)
    const blockb = executor.blocks.get(0xb)
    const blockf = executor.blocks.get(0xf)
    expect(executor.blocks.length()).toEqual(3)
    expect(executor.blocks.keys()).toEqual([0x0, 0xb, 0xf])
    expect(block0.childA).toEqual(0xf)
    expect(block0.childB).toEqual(0xb)
    expect(blockb.childA).toBeUndefined()
    expect(blockb.childB).toBeUndefined()
    expect(blockf.childA).toBeUndefined()
    expect(blockf.childB).toBeUndefined()
  })

  it('Test block with dynamic JUMP', () => {
    const bytecode = '60056006015660ff6099f360206040f3'
    const executor: EVMExecutor = createExecutor(disassembler, bytecode, cfgCreator, opcodeExecutor)
    executor.run(0)
    const block0 = executor.blocks.get(0x0)
    const blockb = executor.blocks.get(0x6)
    const blockf = executor.blocks.get(0xb)
    expect(executor.blocks.length()).toEqual(3)
    expect(executor.blocks.keys()).toEqual([0x0, 0x6, 0xb])
    expect(block0.childA).toEqual(0xb)
    expect(block0.childB).toBeUndefined()
    expect(blockb.childA).toBeUndefined()
    expect(blockb.childB).toBeUndefined()
    expect(blockf.childA).toBeUndefined()
    expect(blockf.childB).toBeUndefined()
  })

  it('Test real contract binary - constructor', () => {
    const bytecode =
      '6080604052348015600f57600080fd5b5060868061001e6000396000f3fe608060405260043610603f576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063e2179b8e146044575b600080fd5b348015604f57600080fd5b5060566058565b005b5600a165627a7a723058202b2566218088bf32ca5a2f029f04a425067ebe1770872a7b06934044a63a81630029'
    const contract: DisassembledContract = disassembler.disassembleContract(bytecode)
    const constructor = contract.constructor
    const executor = new EVMExecutor(cfgCreator.divideBlocks(constructor), opcodeExecutor)
    executor.run(0)
    const blocks = executor.blocks
    const block0 = blocks.get(0x0)
    const blockb = blocks.get(0xb)
    const blockf = blocks.get(0xf)
    const block1d = blocks.get(0x1d)
    expect(contract.hasConstructor).toBeTruthy()
    expect(blocks.length()).toEqual(4)
    expect(blocks.keys()).toEqual([0x0, 0xb, 0xf, 0x1d])

    expect(block0.childA).toEqual(0xf)
    expect(block0.childB).toEqual(0xb)
    expect(blockb.childA).toBeUndefined()
    expect(blockb.childB).toBeUndefined()
    expect(blockf.childA).toBeUndefined()
    expect(blockf.childB).toBeUndefined()
    expect(block1d.childA).toBeUndefined()
    expect(block1d.childB).toBeUndefined()
  })

  it('Test real contract binary - runtime', () => {
    const bytecode =
      '6080604052348015600f57600080fd5b5060868061001e6000396000f3fe608060405260043610603f576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063e2179b8e146044575b600080fd5b348015604f57600080fd5b5060566058565b005b5600a165627a7a723058202b2566218088bf32ca5a2f029f04a425067ebe1770872a7b06934044a63a81630029'
    const contract: DisassembledContract = disassembler.disassembleContract(bytecode)
    const constructor = contract.runtime
    const executor = new EVMExecutor(cfgCreator.divideBlocks(constructor), opcodeExecutor)
    executor.run(0)
    const blocks = executor.blocks
    expect(contract.hasConstructor).toBeTruthy()
    expect(blocks.length()).toEqual(9)
    expect(blocks.keys()).toEqual([0, 12, 63, 68, 75, 79, 86, 88, 90])
    const block0 = blocks.get(0)
    const block12 = blocks.get(12)
    const block63 = blocks.get(63)
    const block68 = blocks.get(68)
    const block75 = blocks.get(75)
    const block79 = blocks.get(79)
    const block86 = blocks.get(86)
    const block88 = blocks.get(88)
    const block90 = blocks.get(90)

    expect(block0.childA).toEqual(63)
    expect(block0.childB).toEqual(12)
    expect(block12.childA).toEqual(68)
    expect(block12.childB).toEqual(63)
    expect(block63.childA).toBeUndefined()
    expect(block63.childB).toBeUndefined()
    expect(block68.childA).toEqual(79)
    expect(block68.childB).toEqual(75)
    expect(block75.childA).toBeUndefined()
    expect(block75.childB).toBeUndefined()
    expect(block79.childA).toEqual(88)
    expect(block79.childB).toBeUndefined()
    expect(block86.childA).toBeUndefined()
    expect(block86.childB).toBeUndefined()
    expect(block88.childA).toEqual(86)
    expect(block88.childB).toBeUndefined()
    expect(block90.childA).toBeUndefined()
    expect(block90.childB).toBeUndefined()
  })
})
