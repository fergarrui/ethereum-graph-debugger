import { EVM } from '../EVM'
import { Operation } from '../../../bytecode/Operation'

export interface Executor {
  execute(op: Operation, evm: EVM)
}
