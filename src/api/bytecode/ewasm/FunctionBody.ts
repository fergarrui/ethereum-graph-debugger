import { WasmValueType } from "./wasmTypes";

export interface FunctionBody {
  locals: FunctionLocal[]
  bytecodeHex: string
}

export interface FunctionLocal {
  count: number
  valueType: WasmValueType
}
