import { injectable } from "inversify";
import { FunctionBody } from "../FunctionBody";
import { WasmOpcodes } from "../WasmOpcodes";
import { WasmBinary } from "../WasmBinary";
import { findSection, WasmCodeSectionPayload, WasmImportSectionPayload, WasmTypeSectionPayload } from "../WasmSection";
import { WasmSectionType } from "../wasmTypes";
import { WasmCallGraph, WasmGraphNodeType } from "./WasmCallGraph";
import { printSignature, printSignatureForGraph } from "../FuncType";

@injectable()
export class WasmCallgraphCreator {

  createCallgraph(wasm: WasmBinary): WasmCallGraph {
    const callGraph: WasmCallGraph = new WasmCallGraph()
    let offset = 0
    const functions: FunctionBody[] = (findSection(wasm.sections, WasmSectionType.Code).payload as WasmCodeSectionPayload).functions
    // add all nodes
    const importsSection = findSection(wasm.sections, WasmSectionType.Import)
    
    if (importsSection) {
      const importsPayload: WasmImportSectionPayload = importsSection.payload as WasmImportSectionPayload
      importsPayload.imports.forEach((imp, index) => {
        offset++
        callGraph.addNode(index, `${imp.moduleName}_${imp.fieldName}`, WasmGraphNodeType.FUNCTION)
      })
    }

    functions.forEach((fun, index) => {
      callGraph.addNode(index + offset, fun.exportedName? fun.exportedName : fun.name, WasmGraphNodeType.FUNCTION)
    })

    const typesSection = findSection(wasm.sections, WasmSectionType.Type)
    if(typesSection) {
      const typesPayload: WasmTypeSectionPayload = typesSection.payload as WasmTypeSectionPayload
      typesPayload.functions.forEach((typeFun, index) => {
        callGraph.addNode(index, `${printSignatureForGraph(index, typeFun)}`, WasmGraphNodeType.TYPE)
      })
    }

    // add relations
    functions.forEach((fun, indexCaller) => {
      fun.opcodes.forEach((opcode, opcodeIndex) => {
        if(WasmOpcodes.isCall(opcode)) {
          const callImmediate = parseInt(opcode.immediates[0], 16)
          callGraph.addRelation(indexCaller + offset, callImmediate, WasmGraphNodeType.FUNCTION)
        } else if (WasmOpcodes.isIndirectCall(opcode)) {
          const callImmediate = parseInt(opcode.immediates[0], 16)
          callGraph.addRelation(indexCaller + offset, callImmediate, WasmGraphNodeType.TYPE)
        }
      })
    })
    return callGraph
  }


}
