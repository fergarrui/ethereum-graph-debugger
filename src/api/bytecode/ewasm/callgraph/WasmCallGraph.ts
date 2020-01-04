import { WasmCallGraphFunction } from "./WasmCallGraphFunction";

export interface WasmCallGraph {
  functions: Map<number, WasmCallGraphFunction>
}
