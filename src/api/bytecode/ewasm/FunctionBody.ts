import { WasmValueType } from "./wasmTypes";
import { WasmOpcode, WasmOpcodes } from "./WasmOpcodes";

export interface FunctionBody {
  locals: FunctionLocal[]
  bytecodeHex: string
  opcodes: WasmOpcode[]
  formattedOpcodes: string
}

export interface FunctionLocal {
  count: number
  valueType: WasmValueType
}

export const formatOpcodes = (opcodes: WasmOpcode[]): string => {
  const newLine = '\n'
  const tab = '  '
  let formattedCode = ''
  let indentation = 0
  for (const op of opcodes) {
    formattedCode += `${tab.repeat(indentation)}${op.opcode.name} ${op.immediates}`
    formattedCode += newLine
    if (WasmOpcodes.isBlockStart(op)) {
      indentation++
    } else if (WasmOpcodes.isBlockEnd(op)) {
      indentation--
    }
  }
  return formattedCode
}
