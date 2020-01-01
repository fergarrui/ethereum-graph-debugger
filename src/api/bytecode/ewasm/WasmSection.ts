import { WasmSectionType } from "./wasmTypes";
import { FuncType } from "./FuncType";
import { ExportEntry } from "./ExportEntry";
import { FunctionBody } from "./FunctionBody";

export interface WasmSection {
  sectionType: WasmSectionType
  payloadLength: number,
  payloadData: Buffer,
  payloadHex: string,
  payload: WasmSectionPayload
}

export interface WasmSectionPayload {

}

export interface WasmTypeSectionPayload extends WasmSectionPayload {
  functions: FuncType[]
}

export interface WasmExportSectionPayload extends WasmSectionPayload {
  exports: ExportEntry[]
}

export interface WasmCodeSectionPayload extends WasmSectionPayload {
  functions: FunctionBody[]
}
