import { WasmCFGBlock } from "./WasmCFGBlock";

export interface WasmFunctionCGF {
  cfgBlocks: Map<number, WasmCFGBlock> 
}
