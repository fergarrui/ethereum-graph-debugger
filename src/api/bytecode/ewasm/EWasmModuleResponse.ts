import { WasmBinary } from "./WasmBinary";

export interface EWasmModuleResponse {
  binary: WasmBinary
  dotCallGraph: string
  functionsCfg: string[]
}
