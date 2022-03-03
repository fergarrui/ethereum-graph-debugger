import { WasmExternalKind } from "./wasmTypes";

export interface ImportEntry {
  moduleName: string
  fieldName: string
  kind: WasmExternalKind
  kindType: any
}
