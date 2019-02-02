export interface DebugTrace {
  id: number
  jsonrpc: number
  result: {
    gas: number
    returnValue: string
    structLogs: {
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
