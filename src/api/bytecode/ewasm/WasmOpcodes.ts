import { OpcodeImmediateType } from "./OpcodeImmediateType";

export class WasmOpcodes {
  static opcodes: Map<number, WasmOpcodeDefinition> = new Map()
  static populate() {
    // control
    this.opcodes.set(0x0, {code: 0x0, name: 'unreachable', immediates: []})
    this.opcodes.set(0x1, {code: 0x1, name: 'nop', immediates: []})
    this.opcodes.set(0x2, {code: 0x2, name: 'block', immediates: [{type: OpcodeImmediateType.BYTE}]})
    this.opcodes.set(0x3, {code: 0x3, name: 'loop', immediates: [{type: OpcodeImmediateType.BYTE}]})
    this.opcodes.set(0x4, {code: 0x4, name: 'if', immediates: [{type: OpcodeImmediateType.BYTE}]})
    this.opcodes.set(0x5, {code: 0x5, name: 'else', immediates: []})
    
    this.opcodes.set(0xc, {code: 0xc, name: 'br', immediates: [{type: OpcodeImmediateType.U32}]})
    this.opcodes.set(0xd, {code: 0xd, name: 'br_if', immediates: [{type: OpcodeImmediateType.U32}]})
    this.opcodes.set(0xe, {code: 0xe, name: 'br_table', immediates: [{type: OpcodeImmediateType.VECTOR_U32},{type: OpcodeImmediateType.U32}]})
    
    this.opcodes.set(0xf, {code: 0xf, name: 'return', immediates: []})
    this.opcodes.set(0x10, {code: 0x10, name: 'call', immediates: [{type: OpcodeImmediateType.U32}]})
    this.opcodes.set(0x11, {code: 0x11, name: 'call_indirect', immediates: [{type: OpcodeImmediateType.U32}, {type: OpcodeImmediateType.BYTE}]})
    
    // parametric
    this.opcodes.set(0x1a, {code: 0x1a, name: 'drop', immediates: []})
    this.opcodes.set(0x1b, {code: 0x1b, name: 'select', immediates: []})

    // variable
    this.opcodes.set(0x20, {code: 0x20, name: 'local.get', immediates: [{type: OpcodeImmediateType.U32}]})
    this.opcodes.set(0x21, {code: 0x21, name: 'local.set', immediates: [{type: OpcodeImmediateType.U32}]})
    this.opcodes.set(0x22, {code: 0x22, name: 'local.tee', immediates: [{type: OpcodeImmediateType.U32}]})
    this.opcodes.set(0x23, {code: 0x23, name: 'global.get', immediates: [{type: OpcodeImmediateType.U32}]})
    this.opcodes.set(0x24, {code: 0x24, name: 'global.set', immediates: [{type: OpcodeImmediateType.U32}]})
    
    // memory
    this.opcodes.set(0x28, {code: 0x28, name: 'i32.load', immediates: [{type: OpcodeImmediateType.U32 }, {type: OpcodeImmediateType.U32 }]})
    this.opcodes.set(0x29, {code: 0x29, name: 'i64.load', immediates: [{type: OpcodeImmediateType.U32 }, {type: OpcodeImmediateType.U32 }]})
    this.opcodes.set(0x2a, {code: 0x2a, name: 'f32.load', immediates: [{type: OpcodeImmediateType.U32 }, {type: OpcodeImmediateType.U32 }]})
    this.opcodes.set(0x2b, {code: 0x2b, name: 'f64.load', immediates: [{type: OpcodeImmediateType.U32 }, {type: OpcodeImmediateType.U32 }]})
    this.opcodes.set(0x2c, {code: 0x2c, name: 'i32.load8_s', immediates: [{type: OpcodeImmediateType.U32 }, {type: OpcodeImmediateType.U32 }]})
    this.opcodes.set(0x2d, {code: 0x2d, name: 'i32.load8_u', immediates: [{type: OpcodeImmediateType.U32 }, {type: OpcodeImmediateType.U32 }]})
    this.opcodes.set(0x2e, {code: 0x2e, name: 'i32.load16_s', immediates: [{type: OpcodeImmediateType.U32 }, {type: OpcodeImmediateType.U32 }]})
    this.opcodes.set(0x2f, {code: 0x2f, name: 'i32.load16_u', immediates: [{type: OpcodeImmediateType.U32 }, {type: OpcodeImmediateType.U32 }]})
    this.opcodes.set(0x30, {code: 0x30, name: 'i64.load8_s', immediates: [{type: OpcodeImmediateType.U32 }, {type: OpcodeImmediateType.U32 }]})
    this.opcodes.set(0x31, {code: 0x31, name: 'i64.load8_u', immediates: [{type: OpcodeImmediateType.U32 }, {type: OpcodeImmediateType.U32 }]})
    this.opcodes.set(0x32, {code: 0x32, name: 'i64.load16_s', immediates: [{type: OpcodeImmediateType.U32 }, {type: OpcodeImmediateType.U32 }]})
    this.opcodes.set(0x33, {code: 0x33, name: 'i64.load16_u', immediates: [{type: OpcodeImmediateType.U32 }, {type: OpcodeImmediateType.U32 }]})
    this.opcodes.set(0x34, {code: 0x34, name: 'i64.load32_s', immediates: [{type: OpcodeImmediateType.U32 }, {type: OpcodeImmediateType.U32 }]})
    this.opcodes.set(0x35, {code: 0x35, name: 'i64.load32_u', immediates: [{type: OpcodeImmediateType.U32 }, {type: OpcodeImmediateType.U32 }]})
    this.opcodes.set(0x36, {code: 0x36, name: 'i32.store', immediates: [{type: OpcodeImmediateType.U32 }, {type: OpcodeImmediateType.U32 }]})
    this.opcodes.set(0x37, {code: 0x37, name: 'i64.store', immediates: [{type: OpcodeImmediateType.U32 }, {type: OpcodeImmediateType.U32 }]})
    this.opcodes.set(0x38, {code: 0x38, name: 'f32.store', immediates: [{type: OpcodeImmediateType.U32 }, {type: OpcodeImmediateType.U32 }]})
    this.opcodes.set(0x39, {code: 0x39, name: 'f64.store', immediates: [{type: OpcodeImmediateType.U32 }, {type: OpcodeImmediateType.U32 }]})
    this.opcodes.set(0x3a, {code: 0x3a, name: 'i32.store8', immediates: [{type: OpcodeImmediateType.U32 }, {type: OpcodeImmediateType.U32 }]})
    this.opcodes.set(0x3b, {code: 0x3b, name: 'i32.store16', immediates: [{type: OpcodeImmediateType.U32 }, {type: OpcodeImmediateType.U32 }]})
    this.opcodes.set(0x3c, {code: 0x3c, name: 'i64.store8', immediates: [{type: OpcodeImmediateType.U32 }, {type: OpcodeImmediateType.U32 }]})
    this.opcodes.set(0x3d, {code: 0x3d, name: 'i64.store16', immediates: [{type: OpcodeImmediateType.U32 }, {type: OpcodeImmediateType.U32 }]})
    this.opcodes.set(0x3e, {code: 0x3e, name: 'i64.store32', immediates: [{type: OpcodeImmediateType.U32 }, {type: OpcodeImmediateType.U32 }]})
    this.opcodes.set(0x3f, {code: 0x3f, name: 'memory.size', immediates: [{type: OpcodeImmediateType.BYTE }]})
    this.opcodes.set(0x40, {code: 0x40, name: 'memory.grow', immediates: [{type: OpcodeImmediateType.BYTE }]})

    // numeric
    this.opcodes.set(0x41, {code: 0x41, name: 'i32.const', immediates: [{type: OpcodeImmediateType.I32}]})
    this.opcodes.set(0x42, {code: 0x42, name: 'i64.const', immediates: [{type: OpcodeImmediateType.I32}]})
    // TODO ADD FLOAT instructions!!
    this.opcodes.set(0x45, {code: 0x45, name: 'i32.eqz', immediates: []})
    this.opcodes.set(0x46, {code: 0x46, name: 'i32.eq', immediates: []})
    this.opcodes.set(0x47, {code: 0x47, name: 'i32.ne', immediates: []})
    this.opcodes.set(0x48, {code: 0x48, name: 'i32.lt_s', immediates: []})
    this.opcodes.set(0x49, {code: 0x49, name: 'i32.lt_u', immediates: []})
    this.opcodes.set(0x4a, {code: 0x4a, name: 'i32.gt_s', immediates: []})
    this.opcodes.set(0x4b, {code: 0x4b, name: 'i32.gt_u', immediates: []})
    this.opcodes.set(0x4c, {code: 0x4c, name: 'i32.le_s', immediates: []})
    this.opcodes.set(0x4d, {code: 0x4d, name: 'i32.le_u', immediates: []})
    this.opcodes.set(0x4e, {code: 0x4e, name: 'i32.ge_s', immediates: []})
    this.opcodes.set(0x4f, {code: 0x4f, name: 'i32.ge_u', immediates: []})

    this.opcodes.set(0x50, {code: 0x50, name: 'i64.eqz', immediates: []})
    this.opcodes.set(0x51, {code: 0x51, name: 'i64.eq', immediates: []})
    this.opcodes.set(0x52, {code: 0x52, name: 'i64.ne', immediates: []})
    this.opcodes.set(0x53, {code: 0x53, name: 'i64.lt_s', immediates: []})
    this.opcodes.set(0x54, {code: 0x54, name: 'i64.lt_u', immediates: []})
    this.opcodes.set(0x55, {code: 0x55, name: 'i64.gt_s', immediates: []})
    this.opcodes.set(0x56, {code: 0x56, name: 'i64.gt_u', immediates: []})
    this.opcodes.set(0x57, {code: 0x57, name: 'i64.le_s', immediates: []})
    this.opcodes.set(0x58, {code: 0x58, name: 'i64.le_u', immediates: []})
    this.opcodes.set(0x59, {code: 0x59, name: 'i64.ge_s', immediates: []})
    this.opcodes.set(0x5a, {code: 0x5a, name: 'i64.ge_u', immediates: []})

    this.opcodes.set(0x5b, {code: 0x5b, name: 'f32.eq', immediates: []})
    this.opcodes.set(0x5c, {code: 0x5c, name: 'f32.ne', immediates: []})
    this.opcodes.set(0x5d, {code: 0x5d, name: 'f32.lt', immediates: []})
    this.opcodes.set(0x5e, {code: 0x5e, name: 'f32.gt', immediates: []})
    this.opcodes.set(0x5f, {code: 0x5f, name: 'f32.le', immediates: []})
    this.opcodes.set(0x60, {code: 0x60, name: 'f32.ge', immediates: []})

    this.opcodes.set(0x61, {code: 0x61, name: 'f64.eq', immediates: []})
    this.opcodes.set(0x62, {code: 0x62, name: 'f64.ne', immediates: []})
    this.opcodes.set(0x63, {code: 0x63, name: 'f64.lt', immediates: []})
    this.opcodes.set(0x64, {code: 0x64, name: 'f64.gt', immediates: []})
    this.opcodes.set(0x65, {code: 0x65, name: 'f64.le', immediates: []})
    this.opcodes.set(0x66, {code: 0x66, name: 'f64.ge', immediates: []})

    this.opcodes.set(0x67, {code: 0x67, name: 'i32.clz', immediates: []})
    this.opcodes.set(0x68, {code: 0x68, name: 'i32.ctz', immediates: []})
    this.opcodes.set(0x69, {code: 0x69, name: 'i32.popcnt', immediates: []})
    this.opcodes.set(0x6a, {code: 0x6a, name: 'i32.add', immediates: []})
    this.opcodes.set(0x6b, {code: 0x6b, name: 'i32.sub', immediates: []})
    this.opcodes.set(0x6c, {code: 0x6c, name: 'i32.mul', immediates: []})
    this.opcodes.set(0x6d, {code: 0x6d, name: 'i32.div_s', immediates: []})
    this.opcodes.set(0x6e, {code: 0x6e, name: 'i32.div_u', immediates: []})
    this.opcodes.set(0x6f, {code: 0x6f, name: 'i32.rem_s', immediates: []})
    this.opcodes.set(0x70, {code: 0x70, name: 'i32.rem_u', immediates: []})
    this.opcodes.set(0x71, {code: 0x71, name: 'i32.and', immediates: []})
    this.opcodes.set(0x72, {code: 0x72, name: 'i32.or', immediates: []})
    this.opcodes.set(0x73, {code: 0x73, name: 'i32.xor', immediates: []})
    this.opcodes.set(0x74, {code: 0x74, name: 'i32.shl', immediates: []})
    this.opcodes.set(0x75, {code: 0x75, name: 'i32.shr_s', immediates: []})
    this.opcodes.set(0x76, {code: 0x76, name: 'i32.shr_u', immediates: []})
    this.opcodes.set(0x77, {code: 0x77, name: 'i32.rotl', immediates: []})
    this.opcodes.set(0x78, {code: 0x78, name: 'i32.rotr', immediates: []})

    this.opcodes.set(0x79, {code: 0x79, name: 'i64.clz', immediates: []})
    this.opcodes.set(0x7a, {code: 0x7a, name: 'i64.ctz', immediates: []})
    this.opcodes.set(0x7b, {code: 0x7b, name: 'i64.popcnt', immediates: []})
    this.opcodes.set(0x7c, {code: 0x7c, name: 'i64.add', immediates: []})
    this.opcodes.set(0x7d, {code: 0x7d, name: 'i64.sub', immediates: []})
    this.opcodes.set(0x7e, {code: 0x7e, name: 'i64.mul', immediates: []})
    this.opcodes.set(0x7f, {code: 0x7f, name: 'i64.div_s', immediates: []})
    this.opcodes.set(0x80, {code: 0x80, name: 'i64.div_u', immediates: []})
    this.opcodes.set(0x81, {code: 0x81, name: 'i64.rem_s', immediates: []})
    this.opcodes.set(0x82, {code: 0x82, name: 'i64.rem_u', immediates: []})
    this.opcodes.set(0x83, {code: 0x83, name: 'i64.and', immediates: []})
    this.opcodes.set(0x84, {code: 0x84, name: 'i64.or', immediates: []})
    this.opcodes.set(0x85, {code: 0x85, name: 'i64.xor', immediates: []})
    this.opcodes.set(0x86, {code: 0x86, name: 'i64.shl', immediates: []})
    this.opcodes.set(0x87, {code: 0x87, name: 'i64.shr_s', immediates: []})
    this.opcodes.set(0x88, {code: 0x88, name: 'i64.shr_u', immediates: []})
    this.opcodes.set(0x89, {code: 0x89, name: 'i64.rotl', immediates: []})
    this.opcodes.set(0x8a, {code: 0x8a, name: 'i64.rotr', immediates: []})
    
    this.opcodes.set(0x8b, {code: 0x8b, name: 'f32.abs', immediates: []})
    this.opcodes.set(0x8c, {code: 0x8c, name: 'f32.neg', immediates: []})
    this.opcodes.set(0x8d, {code: 0x8d, name: 'f32.ceil', immediates: []})
    this.opcodes.set(0x8e, {code: 0x8e, name: 'f32.floor', immediates: []})
    this.opcodes.set(0x8f, {code: 0x8f, name: 'f32.trunc', immediates: []})
    this.opcodes.set(0x90, {code: 0x90, name: 'f32.nearest', immediates: []})
    this.opcodes.set(0x91, {code: 0x91, name: 'f32.sqrt', immediates: []})
    this.opcodes.set(0x92, {code: 0x92, name: 'f32.add', immediates: []})
    this.opcodes.set(0x93, {code: 0x93, name: 'f32.sub', immediates: []})
    this.opcodes.set(0x94, {code: 0x94, name: 'f32.mul', immediates: []})
    this.opcodes.set(0x95, {code: 0x95, name: 'f32.div', immediates: []})
    this.opcodes.set(0x96, {code: 0x96, name: 'f32.min', immediates: []})
    this.opcodes.set(0x97, {code: 0x97, name: 'f32.max', immediates: []})
    this.opcodes.set(0x98, {code: 0x98, name: 'f32.copysign', immediates: []})
    
    this.opcodes.set(0x99, {code: 0x99, name: 'f64.abs', immediates: []})
    this.opcodes.set(0x9a, {code: 0x9a, name: 'f64.neg', immediates: []})
    this.opcodes.set(0x9b, {code: 0x9b, name: 'f64.ceil', immediates: []})
    this.opcodes.set(0x9c, {code: 0x9c, name: 'f64.floor', immediates: []})
    this.opcodes.set(0x9d, {code: 0x9d, name: 'f64.trunc', immediates: []})
    this.opcodes.set(0x9e, {code: 0x9e, name: 'f64.nearest', immediates: []})
    this.opcodes.set(0x9f, {code: 0x9f, name: 'f64.sqrt', immediates: []})
    this.opcodes.set(0xa0, {code: 0xa0, name: 'f64.add', immediates: []})
    this.opcodes.set(0xa1, {code: 0xa1, name: 'f64.sub', immediates: []})
    this.opcodes.set(0xa2, {code: 0xa2, name: 'f64.mul', immediates: []})
    this.opcodes.set(0xa3, {code: 0xa3, name: 'f64.div', immediates: []})
    this.opcodes.set(0xa4, {code: 0xa4, name: 'f64.min', immediates: []})
    this.opcodes.set(0xa5, {code: 0xa5, name: 'f64.max', immediates: []})
    this.opcodes.set(0xa6, {code: 0xa6, name: 'f64.copysign', immediates: []})


    this.opcodes.set(0xa7, {code: 0xa7, name: 'i32.wrap_i64', immediates: []})
    this.opcodes.set(0xa8, {code: 0xa8, name: 'i32.trunc_f32_s', immediates: []})
    this.opcodes.set(0xa9, {code: 0xa9, name: 'i32.trunc_f32_u', immediates: []})
    this.opcodes.set(0xaa, {code: 0xaa, name: 'i32.trunc_f64_s', immediates: []})
    this.opcodes.set(0xab, {code: 0xab, name: 'i32.trunc_f64_u', immediates: []})
    this.opcodes.set(0xac, {code: 0xac, name: 'i64.extend_i32_s', immediates: []})
    this.opcodes.set(0xad, {code: 0xad, name: 'i64.extend_i32_u', immediates: []})
    this.opcodes.set(0xae, {code: 0xae, name: 'i64.trunc_f32_s', immediates: []})
    this.opcodes.set(0xaf, {code: 0xaf, name: 'i64.trunc_f32_u', immediates: []})
    this.opcodes.set(0xb0, {code: 0xb0, name: 'i64.trunc_f64_s', immediates: []})
    this.opcodes.set(0xb1, {code: 0xb1, name: 'i64.trunc_f64_u', immediates: []})
    this.opcodes.set(0xb2, {code: 0xb2, name: 'f32.convert_i32_s', immediates: []})
    this.opcodes.set(0xb3, {code: 0xb3, name: 'f32.convert_i32_u', immediates: []})
    this.opcodes.set(0xb4, {code: 0xb4, name: 'f32.convert_i64_s', immediates: []})
    this.opcodes.set(0xb5, {code: 0xb5, name: 'f32.convert_i64_u', immediates: []})
    this.opcodes.set(0xb6, {code: 0xb6, name: 'f32.demote_f64', immediates: []})
    this.opcodes.set(0xb7, {code: 0xb7, name: 'f64.convert_i32_s', immediates: []})
    this.opcodes.set(0xb8, {code: 0xb8, name: 'f64.convert_i32_u', immediates: []})
    this.opcodes.set(0xb9, {code: 0xb9, name: 'f64.convert_i64_s', immediates: []})
    this.opcodes.set(0xba, {code: 0xba, name: 'f64.convert_i64_u', immediates: []})
    this.opcodes.set(0xbb, {code: 0xbb, name: 'f64.promote_f32', immediates: []})
    this.opcodes.set(0xbc, {code: 0xbc, name: 'i32.reinterpret_f32', immediates: []})
    this.opcodes.set(0xbd, {code: 0xbd, name: 'i64.reinterpret_f64', immediates: []})
    this.opcodes.set(0xbe, {code: 0xbe, name: 'f32.reinterpret_i32', immediates: []})
    this.opcodes.set(0xbf, {code: 0xbf, name: 'f64.reinterpret_i64', immediates: []})

    this.opcodes.set(0xb, {code: 0xb, name: 'end', immediates: []})
  }

  static getDefinition(code: number): WasmOpcodeDefinition {
    return this.opcodes.get(code)
  }

  static isBlockStart(opcode: WasmOpcode): boolean {
    return opcode.opcode.name === 'block' ||
      opcode.opcode.name === 'if' ||
      opcode.opcode.name === 'else' ||
      opcode.opcode.name === 'loop'
  }

  static isBlockEnd(opcode: WasmOpcode): boolean {
    return opcode.opcode.name === 'end'
  }

  static isCall(opcode: WasmOpcode): boolean {
    return opcode.opcode.name === 'call'
  }
}

export interface WasmOpcodeDefinition {
  code: number
  name: string
  immediates: Immediate[]
}

export interface Immediate {
  type: OpcodeImmediateType
}


export interface WasmOpcode {
  opcode: WasmOpcodeDefinition
  immediates: string[]
}

WasmOpcodes.populate()
