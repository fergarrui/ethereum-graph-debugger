import 'reflect-metadata'
import { Disassembler } from './Disassembler'
import { DisassembledContract } from './DisassembledContract'
import { createEVMDisassembler } from '../symbolic/evm/exec/TestUtils';
let BN = require('bn.js')

describe('Disassembler test', () => {
  let disass: Disassembler

  beforeEach(() => {
    disass = createEVMDisassembler()
  })

  it('Test disassembler bytecode', async () => {
    const bytecode = '0x161718'
    const expectedOpcodes = [
      { offset: 0, opcode: { name: 'AND', opcode: 0x16, parameters: 0 }, argument: new BN('0', 16) },
      { offset: 1, opcode: { name: 'OR', opcode: 0x17, parameters: 0 }, argument: new BN('0', 16) },
      { offset: 2, opcode: { name: 'XOR', opcode: 0x18, parameters: 0 }, argument: new BN('0', 16) }
    ]
    const opcodes = disass.disassembleBytecode(bytecode)
    expect(opcodes).toEqual(expectedOpcodes)
  })

  it('Test disassembler bytecode with push1', async () => {
    const bytecode = '60406080'
    const expectedOpcodes = [
      { offset: 0, opcode: { name: 'PUSH1', opcode: 0x60, parameters: 1 }, argument: new BN(`40`, 16) },
      { offset: 2, opcode: { name: 'PUSH1', opcode: 0x60, parameters: 1 }, argument: new BN(`80`, 16) }
    ]
    const opcodes = disass.disassembleBytecode(bytecode)
    expect(opcodes).toEqual(expectedOpcodes)
  })

  it('Test disassembler bytecode with push1 starting with 0x', async () => {
    const bytecode = '0x60406080'
    const expectedOpcodes = [
      { offset: 0, opcode: { name: 'PUSH1', opcode: 0x60, parameters: 1 }, argument: new BN(`40`, 16) },
      { offset: 2, opcode: { name: 'PUSH1', opcode: 0x60, parameters: 1 }, argument: new BN(`80`, 16) }
    ]
    const opcodes = disass.disassembleBytecode(bytecode)
    expect(opcodes).toEqual(expectedOpcodes)
  })

  it('Test combined contract runtime init', () => {
    const bytecode = '0x608060405260043610610041576000357c010000000000000000000000000000000000000000000000000000000090'
    const expectedOpcodes = [
      { offset: 0, opcode: { name: 'PUSH1', opcode: 0x60, parameters: 1 }, argument: new BN(`80`, 16) },
      { offset: 2, opcode: { name: 'PUSH1', opcode: 0x60, parameters: 1 }, argument: new BN(`40`, 16) },
      { offset: 4, opcode: { name: 'MSTORE', opcode: 0x52, parameters: 0 }, argument: new BN(`0`, 16) },
      { offset: 5, opcode: { name: 'PUSH1', opcode: 0x60, parameters: 1 }, argument: new BN(`04`, 16) },
      { offset: 7, opcode: { name: 'CALLDATASIZE', opcode: 0x36, parameters: 0 }, argument: new BN(`0`, 16) },
      { offset: 8, opcode: { name: 'LT', opcode: 0x10, parameters: 0 }, argument: new BN(`0`, 16) },
      { offset: 9, opcode: { name: 'PUSH2', opcode: 0x61, parameters: 2 }, argument: new BN(`0041`, 16) },
      { offset: 12, opcode: { name: 'JUMPI', opcode: 0x57, parameters: 0 }, argument: new BN(`0`, 16) },
      { offset: 13, opcode: { name: 'PUSH1', opcode: 0x60, parameters: 1 }, argument: new BN(`0`, 16) },
      { offset: 15, opcode: { name: 'CALLDATALOAD', opcode: 0x35, parameters: 0 }, argument: new BN(`0`, 16) },
      {
        offset: 16,
        opcode: { name: 'PUSH29', opcode: 0x7c, parameters: 29 },
        argument: new BN(`0100000000000000000000000000000000000000000000000000000000`, 16)
      },
      { offset: 46, opcode: { name: 'SWAP1', opcode: 0x90, parameters: 0 }, argument: new BN(`0`, 16) }
    ]
    const opcodes = disass.disassembleBytecode(bytecode)
    expect(opcodes).toEqual(expectedOpcodes)
  })

  it('Test disassemble contract', () => {
    const bytecode =
      '608060405234801561001057600080fd5b50610150806100206000396000f3fe608060405260043610610041576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063550e833a14610046575b600080fd5b34801561005257600080fd5b50610091600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610093565b005b60008290508073ffffffffffffffffffffffffffffffffffffffff1663e73620c3836040518263ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050600060405180830381600087803b15801561010757600080fd5b505af115801561011b573d6000803e3d6000fd5b505050505050505600a165627a7a7230582023d934aceda66b58be34ed6504f47898d0260cfb00ddc47f6b0a54f108013c7f0029'
    const contract: DisassembledContract = disass.disassembleContract(bytecode)
    const constructor = contract.constructor
    const runtime = contract.runtime
    const firstConstructor = constructor[0]
    const lastConstructor = constructor[constructor.length - 1]
    const firstRuntime = runtime[0]
    const lastRuntime = runtime[runtime.length - 1]
    expect(contract.hasConstructor).toBeTruthy()
    expect(firstConstructor.opcode.name).toEqual('PUSH1')
    expect(lastConstructor.opcode.name).toEqual('INVALID')
    expect(firstRuntime.opcode.name).toEqual('PUSH1')
    expect(lastRuntime.opcode.name).toEqual('STOP')
    expect(firstConstructor.offset).toEqual(0)
    expect(firstRuntime.offset).toEqual(0)
    expect(contract.bytecode).toEqual(bytecode)
  })

  it('Test disassemble contract only runtime', () => {
    const bytecode = '60806040'
    const contract: DisassembledContract = disass.disassembleContract(bytecode)

    expect(contract.hasConstructor).toBeFalsy()
    expect(contract.constructor.length).toEqual(0)
    expect(contract.bytecode).toEqual(bytecode)
  })

  it('Test odd disassembler bytecode', async () => {
    const bytecode = '0x16171'
    expect(() => disass.disassembleBytecode(bytecode)).toThrow()
  })
})
