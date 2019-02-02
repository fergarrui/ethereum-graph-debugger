import { Operation } from './Operation'

export interface DisassembledContract {
  hasConstructor: boolean
  constructor: Operation[]
  runtime: Operation[]
  bytecode: string
  runtimeBytecode: string
}
