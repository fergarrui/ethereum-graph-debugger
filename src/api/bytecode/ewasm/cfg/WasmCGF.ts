import { WasmCFGBlock } from "./WasmCFGBlock";

export interface WasmCGF {
  cfgBlocks: Map<number, WasmCFGBlock> 
}
