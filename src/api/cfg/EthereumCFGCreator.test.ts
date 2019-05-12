import 'reflect-metadata'
import { EthereumCFGCreator } from './EthereumCFGCreator'
import { EVMDisassembler } from '../bytecode/EVMDisassembler'
import { Disassembler } from '../bytecode/Disassembler'
import { Operation } from '../bytecode/Operation'
import { Opcodes } from '../bytecode/Opcodes'
import { CFGBlocks } from './CFGBlocks'
import { createEVMDisassembler } from '../symbolic/evm/exec/TestUtils';
let BN = require('bn.js')

describe('EthereumCFGCreator', () => {
  let cfgCreator: EthereumCFGCreator
  let disassembler: Disassembler

  beforeEach(() => {
    cfgCreator = new EthereumCFGCreator()
    disassembler = createEVMDisassembler()
  })

  it('Test blocks correctly created, no jumps', () => {
    const bytecode = '60806040'
    const ops: Operation[] = disassembler.disassembleBytecode(bytecode)
    const cfg: CFGBlocks = cfgCreator.divideBlocks(ops)
    const expectedBlocks: CFGBlocks = new CFGBlocks()
    expectedBlocks.push(
      {
        offset: 0,
        operations: [createOperation(0, '80', 'PUSH1'), createOperation(2, '40', 'PUSH1')]
      },
      0
    )
    expect(cfg.length()).toEqual(1)
    expect(cfg).toEqual(expectedBlocks)
  })

  it('Test blocks correctly created, JUMP', () => {
    const bytecode = '60806040565b5050'
    const ops: Operation[] = disassembler.disassembleBytecode(bytecode)
    const cfg: CFGBlocks = cfgCreator.divideBlocks(ops)
    const expectedBlocks: CFGBlocks = new CFGBlocks()
    expectedBlocks.push(
      {
        offset: 0,
        operations: [
          createOperation(0, '80', 'PUSH1'),
          createOperation(2, '40', 'PUSH1'),
          createOperation(4, '0', 'JUMP')
        ]
      },
      0
    )
    expectedBlocks.push(
      {
        offset: 5,
        operations: [
          createOperation(5, '0', 'JUMPDEST'),
          createOperation(6, '0', 'POP'),
          createOperation(7, '0', 'POP')
        ]
      },
      5
    )
    expect(cfg.length()).toEqual(2)
    expect(cfg).toEqual(expectedBlocks)
  })

  it('Test blocks correctly created, JUMPI', () => {
    const bytecode = '60806040575b5050'
    const ops: Operation[] = disassembler.disassembleBytecode(bytecode)
    const cfg: CFGBlocks = cfgCreator.divideBlocks(ops)
    const expectedBlocks: CFGBlocks = new CFGBlocks()
    expectedBlocks.push(
      {
        offset: 0,
        operations: [
          createOperation(0, '80', 'PUSH1'),
          createOperation(2, '40', 'PUSH1'),
          createOperation(4, '0', 'JUMPI')
        ]
      },
      0
    )
    expectedBlocks.push(
      {
        offset: 5,
        operations: [
          createOperation(5, '0', 'JUMPDEST'),
          createOperation(6, '0', 'POP'),
          createOperation(7, '0', 'POP')
        ]
      },
      5
    )
    expect(cfg.length()).toEqual(2)
    expect(cfg).toEqual(expectedBlocks)
  })

  it('Test blocks correctly created, STOP', () => {
    const bytecode = '60806040005050'
    const ops: Operation[] = disassembler.disassembleBytecode(bytecode)
    const cfg: CFGBlocks = cfgCreator.divideBlocks(ops)
    const expectedBlocks: CFGBlocks = new CFGBlocks()
    expectedBlocks.push(
      {
        offset: 0,
        operations: [
          createOperation(0, '80', 'PUSH1'),
          createOperation(2, '40', 'PUSH1'),
          createOperation(4, '0', 'STOP')
        ]
      },
      0
    )
    expectedBlocks.push(
      {
        offset: 5,
        operations: [createOperation(5, '0', 'POP'), createOperation(6, '0', 'POP')]
      },
      5
    )
    expect(cfg.length()).toEqual(2)
    expect(cfg).toEqual(expectedBlocks)
  })

  it('Test blocks correctly created, RETURN', () => {
    const bytecode = '60806040f35050'
    const ops: Operation[] = disassembler.disassembleBytecode(bytecode)
    const cfg: CFGBlocks = cfgCreator.divideBlocks(ops)
    const expectedBlocks: CFGBlocks = new CFGBlocks()
    expectedBlocks.push(
      {
        offset: 0,
        operations: [
          createOperation(0, '80', 'PUSH1'),
          createOperation(2, '40', 'PUSH1'),
          createOperation(4, '0', 'RETURN')
        ]
      },
      0
    )
    expectedBlocks.push(
      {
        offset: 5,
        operations: [createOperation(5, '0', 'POP'), createOperation(6, '0', 'POP')]
      },
      5
    )
    expect(cfg.length()).toEqual(2)
    expect(cfg).toEqual(expectedBlocks)
  })

  it('Test blocks correctly created, REVERT', () => {
    const bytecode = '60806040fd5050'
    const ops: Operation[] = disassembler.disassembleBytecode(bytecode)
    const cfg: CFGBlocks = cfgCreator.divideBlocks(ops)
    const expectedBlocks: CFGBlocks = new CFGBlocks()
    expectedBlocks.push(
      {
        offset: 0,
        operations: [
          createOperation(0, '80', 'PUSH1'),
          createOperation(2, '40', 'PUSH1'),
          createOperation(4, '0', 'REVERT')
        ]
      },
      0
    )
    expectedBlocks.push(
      {
        offset: 5,
        operations: [createOperation(5, '0', 'POP'), createOperation(6, '0', 'POP')]
      },
      5
    )
    expect(cfg.length()).toEqual(2)
    expect(cfg).toEqual(expectedBlocks)
  })

  it('Test blocks correctly created, INVALID', () => {
    const bytecode = '60806040fe5050'
    const ops: Operation[] = disassembler.disassembleBytecode(bytecode)
    const cfg: CFGBlocks = cfgCreator.divideBlocks(ops)
    const expectedBlocks: CFGBlocks = new CFGBlocks()
    expectedBlocks.push(
      {
        offset: 0,
        operations: [
          createOperation(0, '80', 'PUSH1'),
          createOperation(2, '40', 'PUSH1'),
          createOperation(4, '0', 'INVALID')
        ]
      },
      0
    )
    expectedBlocks.push(
      {
        offset: 5,
        operations: [createOperation(5, '0', 'POP'), createOperation(6, '0', 'POP')]
      },
      5
    )
    expect(cfg.length()).toEqual(2)
    expect(cfg).toEqual(expectedBlocks)
  })
})

function createOperation(offset: number, argument: string, opcodeName: string): Operation {
  return {
    offset: offset,
    argument: new BN(argument, 16),
    opcode: Opcodes.opcodes[opcodeName]
  }
}
