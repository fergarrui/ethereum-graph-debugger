import { OperationResponse } from './OperationResponse'

export interface DisassembledContractResponse {
  hasConstructor: boolean
  constructorOperations: OperationResponse[]
  runtimeOperations: OperationResponse[]
  bytecode: string
}
