import { WasmFunctionCGF } from "./WasmFunctionCGF";

export interface WasmCFG {

  functions: Map<number, WasmFunctionCGF>
  
}
