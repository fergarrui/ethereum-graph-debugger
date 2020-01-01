import { WasmValueType } from "./wasmTypes";

export interface FuncType {
  index: number
  params: WasmValueType[]
  results: WasmValueType[]
}
