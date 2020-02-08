import { Opcode } from './Opcode'

export class EVMOpcodes {
  static opcodes = {}

  static populate() {
    this.opcodes[-1] = { name: 'UNKNOWN', opcode: 0x00, parameters: 0 } as Opcode
    this.opcodes[0x00] = { name: 'STOP', opcode: 0x00, parameters: 0 } as Opcode
    this.opcodes[0x01] = { name: 'ADD', opcode: 0x01, parameters: 0 } as Opcode
    this.opcodes[0x02] = { name: 'MUL', opcode: 0x02, parameters: 0 } as Opcode
    this.opcodes[0x03] = { name: 'SUB', opcode: 0x03, parameters: 0 } as Opcode
    this.opcodes[0x04] = { name: 'DIV', opcode: 0x04, parameters: 0 } as Opcode
    this.opcodes[0x05] = { name: 'SDIV', opcode: 0x05, parameters: 0 } as Opcode
    this.opcodes[0x06] = { name: 'MOD', opcode: 0x06, parameters: 0 } as Opcode
    this.opcodes[0x07] = { name: 'SMOD', opcode: 0x07, parameters: 0 } as Opcode
    this.opcodes[0x08] = { name: 'ADDMOD', opcode: 0x08, parameters: 0 } as Opcode
    this.opcodes[0x09] = { name: 'MULMOD', opcode: 0x09, parameters: 0 } as Opcode
    this.opcodes[0x0a] = { name: 'EXP', opcode: 0x0a, parameters: 0 } as Opcode
    this.opcodes[0x0b] = { name: 'SIGNEXTEND', opcode: 0x0b, parameters: 0 } as Opcode
    this.opcodes[0x10] = { name: 'LT', opcode: 0x10, parameters: 0 } as Opcode
    this.opcodes[0x11] = { name: 'GT', opcode: 0x11, parameters: 0 } as Opcode
    this.opcodes[0x12] = { name: 'SLT', opcode: 0x12, parameters: 0 } as Opcode
    this.opcodes[0x13] = { name: 'SGT', opcode: 0x13, parameters: 0 } as Opcode
    this.opcodes[0x14] = { name: 'EQ', opcode: 0x14, parameters: 0 } as Opcode
    this.opcodes[0x15] = { name: 'ISZERO', opcode: 0x15, parameters: 0 } as Opcode
    this.opcodes[0x16] = { name: 'AND', opcode: 0x16, parameters: 0 } as Opcode
    this.opcodes[0x17] = { name: 'OR', opcode: 0x17, parameters: 0 } as Opcode
    this.opcodes[0x18] = { name: 'XOR', opcode: 0x18, parameters: 0 } as Opcode
    this.opcodes[0x19] = { name: 'NOT', opcode: 0x19, parameters: 0 } as Opcode
    this.opcodes[0x1a] = { name: 'BYTE', opcode: 0x1a, parameters: 0 } as Opcode
    this.opcodes[0x1b] = { name: 'SHL', opcode: 0x1b, parameters: 0 } as Opcode
    this.opcodes[0x1c] = { name: 'SHR', opcode: 0x1c, parameters: 0 } as Opcode
    this.opcodes[0x1d] = { name: 'SAR', opcode: 0x1d, parameters: 0 } as Opcode
    this.opcodes[0x20] = { name: 'SHA3', opcode: 0x20, parameters: 0 } as Opcode
    this.opcodes[0x30] = { name: 'ADDRESS', opcode: 0x30, parameters: 0 } as Opcode
    this.opcodes[0x31] = { name: 'BALANCE', opcode: 0x31, parameters: 0 } as Opcode
    this.opcodes[0x32] = { name: 'ORIGIN', opcode: 0x32, parameters: 0 } as Opcode
    this.opcodes[0x33] = { name: 'CALLER', opcode: 0x33, parameters: 0 } as Opcode
    this.opcodes[0x34] = { name: 'CALLVALUE', opcode: 0x34, parameters: 0 } as Opcode
    this.opcodes[0x35] = { name: 'CALLDATALOAD', opcode: 0x35, parameters: 0 } as Opcode
    this.opcodes[0x36] = { name: 'CALLDATASIZE', opcode: 0x36, parameters: 0 } as Opcode
    this.opcodes[0x37] = { name: 'CALLDATACOPY', opcode: 0x37, parameters: 0 } as Opcode
    this.opcodes[0x38] = { name: 'CODESIZE', opcode: 0x38, parameters: 0 } as Opcode
    this.opcodes[0x39] = { name: 'CODECOPY', opcode: 0x39, parameters: 0 } as Opcode
    this.opcodes[0x3a] = { name: 'GASPRICE', opcode: 0x3a, parameters: 0 } as Opcode
    this.opcodes[0x3b] = { name: 'EXTCODESIZE', opcode: 0x3b, parameters: 0 } as Opcode
    this.opcodes[0x3c] = { name: 'EXTCODECOPY', opcode: 0x3c, parameters: 0 } as Opcode
    this.opcodes[0x3d] = { name: 'RETURNDATASIZE', opcode: 0x3d, parameters: 0 } as Opcode
    this.opcodes[0x3e] = { name: 'RETURNDATACOPY', opcode: 0x3e, parameters: 0 } as Opcode
    this.opcodes[0x40] = { name: 'BLOCKHASH', opcode: 0x40, parameters: 0 } as Opcode
    this.opcodes[0x41] = { name: 'COINBASE', opcode: 0x41, parameters: 0 } as Opcode
    this.opcodes[0x42] = { name: 'TIMESTAMP', opcode: 0x42, parameters: 0 } as Opcode
    this.opcodes[0x43] = { name: 'NUMBER', opcode: 0x43, parameters: 0 } as Opcode
    this.opcodes[0x44] = { name: 'DIFFICULTY', opcode: 0x44, parameters: 0 } as Opcode
    this.opcodes[0x45] = { name: 'GASLIMIT', opcode: 0x45, parameters: 0 } as Opcode
    this.opcodes[0x50] = { name: 'POP', opcode: 0x50, parameters: 0 } as Opcode
    this.opcodes[0x51] = { name: 'MLOAD', opcode: 0x51, parameters: 0 } as Opcode
    this.opcodes[0x52] = { name: 'MSTORE', opcode: 0x52, parameters: 0 } as Opcode
    this.opcodes[0x53] = { name: 'MSTORE8', opcode: 0x53, parameters: 0 } as Opcode
    this.opcodes[0x54] = { name: 'SLOAD', opcode: 0x54, parameters: 0 } as Opcode
    this.opcodes[0x55] = { name: 'SSTORE', opcode: 0x55, parameters: 0 } as Opcode
    this.opcodes[0x56] = { name: 'JUMP', opcode: 0x56, parameters: 0 } as Opcode
    this.opcodes[0x57] = { name: 'JUMPI', opcode: 0x57, parameters: 0 } as Opcode
    this.opcodes[0x58] = { name: 'PC', opcode: 0x58, parameters: 0 } as Opcode
    this.opcodes[0x59] = { name: 'MSIZE', opcode: 0x59, parameters: 0 } as Opcode
    this.opcodes[0x5a] = { name: 'GAS', opcode: 0x5a, parameters: 0 } as Opcode
    this.opcodes[0x5b] = { name: 'JUMPDEST', opcode: 0x5b, parameters: 0 } as Opcode
    this.opcodes[0x60] = { name: 'PUSH1', opcode: 0x60, parameters: 1 } as Opcode
    this.opcodes[0x61] = { name: 'PUSH2', opcode: 0x61, parameters: 2 } as Opcode
    this.opcodes[0x62] = { name: 'PUSH3', opcode: 0x62, parameters: 3 } as Opcode
    this.opcodes[0x63] = { name: 'PUSH4', opcode: 0x63, parameters: 4 } as Opcode
    this.opcodes[0x64] = { name: 'PUSH5', opcode: 0x64, parameters: 5 } as Opcode
    this.opcodes[0x65] = { name: 'PUSH6', opcode: 0x65, parameters: 6 } as Opcode
    this.opcodes[0x66] = { name: 'PUSH7', opcode: 0x66, parameters: 7 } as Opcode
    this.opcodes[0x67] = { name: 'PUSH8', opcode: 0x67, parameters: 8 } as Opcode
    this.opcodes[0x68] = { name: 'PUSH9', opcode: 0x68, parameters: 9 } as Opcode
    this.opcodes[0x69] = { name: 'PUSH10', opcode: 0x69, parameters: 10 } as Opcode
    this.opcodes[0x6a] = { name: 'PUSH11', opcode: 0x6a, parameters: 11 } as Opcode
    this.opcodes[0x6b] = { name: 'PUSH12', opcode: 0x6b, parameters: 12 } as Opcode
    this.opcodes[0x6c] = { name: 'PUSH13', opcode: 0x6c, parameters: 13 } as Opcode
    this.opcodes[0x6d] = { name: 'PUSH14', opcode: 0x6d, parameters: 14 } as Opcode
    this.opcodes[0x6e] = { name: 'PUSH15', opcode: 0x6e, parameters: 15 } as Opcode
    this.opcodes[0x6f] = { name: 'PUSH16', opcode: 0x6f, parameters: 16 } as Opcode
    this.opcodes[0x70] = { name: 'PUSH17', opcode: 0x70, parameters: 17 } as Opcode
    this.opcodes[0x71] = { name: 'PUSH18', opcode: 0x71, parameters: 18 } as Opcode
    this.opcodes[0x72] = { name: 'PUSH19', opcode: 0x72, parameters: 19 } as Opcode
    this.opcodes[0x73] = { name: 'PUSH20', opcode: 0x73, parameters: 20 } as Opcode
    this.opcodes[0x74] = { name: 'PUSH21', opcode: 0x74, parameters: 21 } as Opcode
    this.opcodes[0x75] = { name: 'PUSH22', opcode: 0x75, parameters: 22 } as Opcode
    this.opcodes[0x76] = { name: 'PUSH23', opcode: 0x76, parameters: 23 } as Opcode
    this.opcodes[0x77] = { name: 'PUSH24', opcode: 0x77, parameters: 24 } as Opcode
    this.opcodes[0x78] = { name: 'PUSH25', opcode: 0x78, parameters: 25 } as Opcode
    this.opcodes[0x79] = { name: 'PUSH26', opcode: 0x79, parameters: 26 } as Opcode
    this.opcodes[0x7a] = { name: 'PUSH27', opcode: 0x7a, parameters: 27 } as Opcode
    this.opcodes[0x7b] = { name: 'PUSH28', opcode: 0x7b, parameters: 28 } as Opcode
    this.opcodes[0x7c] = { name: 'PUSH29', opcode: 0x7c, parameters: 29 } as Opcode
    this.opcodes[0x7d] = { name: 'PUSH30', opcode: 0x7d, parameters: 30 } as Opcode
    this.opcodes[0x7e] = { name: 'PUSH31', opcode: 0x7e, parameters: 31 } as Opcode
    this.opcodes[0x7f] = { name: 'PUSH32', opcode: 0x7f, parameters: 32 } as Opcode
    this.opcodes[0x80] = { name: 'DUP1', opcode: 0x80, parameters: 0 } as Opcode
    this.opcodes[0x81] = { name: 'DUP2', opcode: 0x81, parameters: 0 } as Opcode
    this.opcodes[0x82] = { name: 'DUP3', opcode: 0x82, parameters: 0 } as Opcode
    this.opcodes[0x83] = { name: 'DUP4', opcode: 0x83, parameters: 0 } as Opcode
    this.opcodes[0x84] = { name: 'DUP5', opcode: 0x84, parameters: 0 } as Opcode
    this.opcodes[0x85] = { name: 'DUP6', opcode: 0x85, parameters: 0 } as Opcode
    this.opcodes[0x86] = { name: 'DUP7', opcode: 0x86, parameters: 0 } as Opcode
    this.opcodes[0x87] = { name: 'DUP8', opcode: 0x87, parameters: 0 } as Opcode
    this.opcodes[0x88] = { name: 'DUP9', opcode: 0x88, parameters: 0 } as Opcode
    this.opcodes[0x89] = { name: 'DUP10', opcode: 0x89, parameters: 0 } as Opcode
    this.opcodes[0x8a] = { name: 'DUP11', opcode: 0x8a, parameters: 0 } as Opcode
    this.opcodes[0x8b] = { name: 'DUP12', opcode: 0x8b, parameters: 0 } as Opcode
    this.opcodes[0x8c] = { name: 'DUP13', opcode: 0x8c, parameters: 0 } as Opcode
    this.opcodes[0x8d] = { name: 'DUP14', opcode: 0x8d, parameters: 0 } as Opcode
    this.opcodes[0x8e] = { name: 'DUP15', opcode: 0x8e, parameters: 0 } as Opcode
    this.opcodes[0x8f] = { name: 'DUP16', opcode: 0x8f, parameters: 0 } as Opcode
    this.opcodes[0x90] = { name: 'SWAP1', opcode: 0x90, parameters: 0 } as Opcode
    this.opcodes[0x91] = { name: 'SWAP2', opcode: 0x91, parameters: 0 } as Opcode
    this.opcodes[0x92] = { name: 'SWAP3', opcode: 0x92, parameters: 0 } as Opcode
    this.opcodes[0x93] = { name: 'SWAP4', opcode: 0x93, parameters: 0 } as Opcode
    this.opcodes[0x94] = { name: 'SWAP5', opcode: 0x94, parameters: 0 } as Opcode
    this.opcodes[0x95] = { name: 'SWAP6', opcode: 0x95, parameters: 0 } as Opcode
    this.opcodes[0x96] = { name: 'SWAP7', opcode: 0x96, parameters: 0 } as Opcode
    this.opcodes[0x97] = { name: 'SWAP8', opcode: 0x97, parameters: 0 } as Opcode
    this.opcodes[0x98] = { name: 'SWAP9', opcode: 0x98, parameters: 0 } as Opcode
    this.opcodes[0x99] = { name: 'SWAP10', opcode: 0x99, parameters: 0 } as Opcode
    this.opcodes[0x9a] = { name: 'SWAP11', opcode: 0x9a, parameters: 0 } as Opcode
    this.opcodes[0x9b] = { name: 'SWAP12', opcode: 0x9b, parameters: 0 } as Opcode
    this.opcodes[0x9c] = { name: 'SWAP13', opcode: 0x9c, parameters: 0 } as Opcode
    this.opcodes[0x9d] = { name: 'SWAP14', opcode: 0x9d, parameters: 0 } as Opcode
    this.opcodes[0x9e] = { name: 'SWAP15', opcode: 0x9e, parameters: 0 } as Opcode
    this.opcodes[0x9f] = { name: 'SWAP16', opcode: 0x9f, parameters: 0 } as Opcode
    this.opcodes[0xa0] = { name: 'LOG0', opcode: 0xa0, parameters: 0 } as Opcode
    this.opcodes[0xa1] = { name: 'LOG1', opcode: 0xa1, parameters: 0 } as Opcode
    this.opcodes[0xa2] = { name: 'LOG2', opcode: 0xa2, parameters: 0 } as Opcode
    this.opcodes[0xa3] = { name: 'LOG3', opcode: 0xa3, parameters: 0 } as Opcode
    this.opcodes[0xa4] = { name: 'LOG4', opcode: 0xa4, parameters: 0 } as Opcode
    this.opcodes[0xf0] = { name: 'CREATE', opcode: 0xf0, parameters: 0 } as Opcode
    this.opcodes[0xf1] = { name: 'CALL', opcode: 0xf1, parameters: 0 } as Opcode
    this.opcodes[0xf2] = { name: 'CALLCODE', opcode: 0xf2, parameters: 0 } as Opcode
    this.opcodes[0xf3] = { name: 'RETURN', opcode: 0xf3, parameters: 0 } as Opcode
    this.opcodes[0xf4] = { name: 'DELEGATECALL', opcode: 0xf4, parameters: 0 } as Opcode
    this.opcodes[0xfa] = { name: 'STATICCALL', opcode: 0xfa, parameters: 0 } as Opcode
    this.opcodes[0xfd] = { name: 'REVERT', opcode: 0xfd, parameters: 0 } as Opcode
    this.opcodes[0xfe] = { name: 'INVALID', opcode: 0xfe, parameters: 0 } as Opcode
    this.opcodes[0xff] = { name: 'SELFDESTRUCT', opcode: 0xff, parameters: 0 } as Opcode // TODO
    // adding also index by name
    for (let i = 0x00; i <= 0xff; i++) {
      const opcode = this.opcodes[i]
      if (opcode) {
        this.opcodes[opcode.name] = opcode
      }
    }
  }

  static isJump(op: Opcode) {
    return op.name.startsWith('JUMP') && op.name !== 'JUMPDEST'
  }

  static isJumpOp(op: string) {
    return op.startsWith('JUMP') && op !== 'JUMPDEST'
  }
}

EVMOpcodes.populate()
