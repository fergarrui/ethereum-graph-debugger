import { Operation } from '../bytecode/Operation'
import { CFGBlocks } from './CFGBlocks'

export interface CFGCreator {
  divideBlocks(ops: Operation[]): CFGBlocks
}
