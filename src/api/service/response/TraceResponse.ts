import { OperationResponse } from './OperationResponse'

export interface TraceResponse {
  cfg: string
  operations: OperationResponse[]
  trace: {
    key: string
    log: {
      depth: number
      error: string
      gas: number
      gasCost: number
      memory: string[]
      op: string
      pc: number
      stack: string[]
      storage: any
    }[]
  }
}
