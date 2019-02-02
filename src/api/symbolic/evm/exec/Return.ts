import { Executor } from './Executor'
import { EVM } from '../EVM'
import { Operation } from '../../../bytecode/Operation'

export class Return implements Executor {
  execute(op: Operation, evm: EVM) {
    evm.stack.pop()
    evm.stack.pop()
  }
}
