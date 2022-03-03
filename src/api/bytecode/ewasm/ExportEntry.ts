import { WasmExternalKind } from "./wasmTypes";

export interface ExportEntry {
  name: string
  kind: WasmExternalKind
  index: number
}
