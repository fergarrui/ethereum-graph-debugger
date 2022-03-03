import { WasmFunctionCGF } from "./WasmFunctionCGF";
import { WasmCFGBlock } from "./WasmCFGBlock";
import { WasmBinary } from "../WasmBinary";
import { formatOpcodes } from "../FunctionBody";
import { findSection, WasmImportSectionPayload, WasmCodeSectionPayload } from "../WasmSection";
import { WasmSectionType } from "../wasmTypes";
import { injectable } from "inversify";

@injectable()
export class WasmCFGGraphVizService {

  convertToDot(cfg: WasmFunctionCGF, wasm: WasmBinary): string {
    let graph = `digraph " " {
      graph [splines=ortho]
      node[shape=box fillcolor="#2A2A2A" style=filled fontname="Courier"]

      ${this.createBody(cfg, wasm)}

    }` 
    return graph
  }

  private createBody(cfg: WasmFunctionCGF, wasm: WasmBinary): string {
    const importSection = findSection(wasm.sections, WasmSectionType.Import)
    const importSectionPayload: WasmImportSectionPayload = importSection ? importSection.payload as WasmImportSectionPayload : {imports: []} as WasmImportSectionPayload
 
    const codeSection = findSection(wasm.sections, WasmSectionType.Code)
    const codeSectionPayload: WasmCodeSectionPayload = codeSection.payload as WasmCodeSectionPayload

    let body = ''
    cfg.cfgBlocks.forEach((value: WasmCFGBlock, key: number) => {
      body += `${key} [label="`
      body+= `${formatOpcodes(value.opcodes, importSectionPayload, codeSectionPayload, '\\l')}`
      body +=`"  fontcolor="#12cc12"]
      ${this.createRelations(value, key)}
      `
    })
    return body
  }

  private createRelations(block: WasmCFGBlock, blockIndex: number) {

    return block.nextBlocks.map(next => {
      return `${blockIndex} -> ${next}`
    }).join('\n')
  }
}
