import { WasmValueType } from "./wasmTypes";
import { WasmOpcode, WasmOpcodes } from "./WasmOpcodes";
import { WasmImportSectionPayload, WasmCodeSectionPayload } from "./WasmSection";

export interface FunctionBody {
  locals: FunctionLocal[]
  bytecodeHex: string
  opcodes?: WasmOpcode[]
  formattedOpcodes?: string
  functionSignature?: string
  name?: string
  exportedName?: string
}

export interface FunctionLocal {
  count: number
  valueType: WasmValueType
}

export const formatOpcodes = (opcodes: WasmOpcode[], importsPayload: WasmImportSectionPayload, codePayload: WasmCodeSectionPayload, newLineChar?: string): string => {
  let newLine = '\n'
  if (newLineChar) {
    newLine = newLineChar
  }
  const tab = '  '
  let formattedCode = ''
  let indentation = 0
  for (const op of opcodes) {
    formattedCode += `${tab.repeat(indentation)} <${op.depth}> ${op.opcode.name} ${op.immediates}`
    if (WasmOpcodes.isCall(op)) {
      const callIdx: number = parseInt(op.immediates[0], 16)
      let functionCalledName = ''
      if (callIdx < importsPayload.imports.length) {
        const imp = importsPayload.imports[callIdx];
        functionCalledName = `${imp.moduleName}_${imp.fieldName}`
      } else {
        const fun = codePayload.functions[callIdx - importsPayload.imports.length]
        if (fun) {
          functionCalledName = `${fun.exportedName? fun.exportedName: fun.name}`
        }
      }
      formattedCode += ` [${functionCalledName}]`
    }
    formattedCode += newLine
    if (WasmOpcodes.isBlockStart(op)) {
      indentation++
    } else if (WasmOpcodes.isBlockEnd(op)) {
      indentation--
    }
  }
  return formattedCode
}
