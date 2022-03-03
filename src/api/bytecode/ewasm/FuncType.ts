import { WasmValueType } from "./wasmTypes";

export interface FuncType {
  params: WasmValueType[]
  results: WasmValueType[]
}

export const printSignature = (index: number, funcType: FuncType): string => {
  let signature = `func_${index}(`
  signature += funcType.params.map(p => p.toString()).join(',')
  signature += ')'
  signature += ':'
  const results = funcType.results.length > 0 ? funcType.results.map(r => r.toString()).join(',') : 'void'
  signature += results
  return signature
}

export const printSignatureForGraph = (index: number, funcType: FuncType): string => {
  let signature = `type_${index}_params_`
  signature += funcType.params.map(p => p.toString()).join('_')
  signature += '_'
  signature += 'results_'
  const results = funcType.results.length > 0 ? funcType.results.map(r => r.toString()).join('_') : 'void'
  signature += results
  return signature
}
