import { OperationResponse } from './OperationResponse'

export interface GFCResponse {
  cfg: string
  operations: OperationResponse[]
  isConstructor: boolean
}
