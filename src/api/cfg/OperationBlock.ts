import { Operation } from '../bytecode/Operation'

export interface OperationBlock {
  offset: number
  operations: Operation[]
  childA?: number
  childB?: number
}
