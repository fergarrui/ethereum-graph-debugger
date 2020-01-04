import { WasmBinary } from "./WasmBinary";

export interface EWasmModule {
  binary: WasmBinary
  dotCallGraph: string
}
