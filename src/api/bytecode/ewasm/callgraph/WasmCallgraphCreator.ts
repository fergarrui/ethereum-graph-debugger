import { injectable } from "inversify";
import { FunctionBody } from "../FunctionBody";
import { WasmOpcodes } from "../WasmOpcodes";
import { WasmBinary } from "../WasmBinary";
import { findSection, WasmCodeSectionPayload, WasmImportSectionPayload } from "../WasmSection";
import { WasmSectionType } from "../wasmTypes";
import { WasmCallGraph } from "./WasmCallGraph";

@injectable()
export class WasmCallgraphCreator {

  createCallgraph(wasm: WasmBinary): WasmCallGraph {
    const callGraph: WasmCallGraph = {
      functions : new Map()
    }
    let offset = 0
    const functions: FunctionBody[] = (findSection(wasm.sections, WasmSectionType.Code).payload as WasmCodeSectionPayload).functions
    const importsSection = findSection(wasm.sections, WasmSectionType.Import)
    if (importsSection) {
      const importsPayload: WasmImportSectionPayload = importsSection.payload as WasmImportSectionPayload
      if (importsPayload.imports.length > 0) {
        importsPayload.imports.forEach((imp, index) => {
          offset++
          callGraph.functions.set(index, {
            calling: [],
            name: `${imp.moduleName}_${imp.fieldName}`
          })
        })
      }
    }
    let funIndex = 0
    for(const fun of functions) {
      const funCalling: number[] = []
      fun.opcodes.filter(op => WasmOpcodes.isCall(op)).forEach(op => {
        const callee: number = parseInt(op.immediates[0], 16)
        if(!funCalling.includes(callee)) {
          funCalling.push(callee)
        }
      })
      callGraph.functions.set(funIndex + offset, {
        calling: funCalling,
        name: fun.exportedName? fun.exportedName : fun.name
      })
      funIndex++
    }
    return callGraph
  }
}
