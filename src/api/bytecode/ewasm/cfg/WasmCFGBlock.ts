import { WasmOpcode } from "../WasmOpcodes";

export interface WasmCFGBlock {
  opcodes: WasmOpcode[]
  nextBlocks: number[]
}
