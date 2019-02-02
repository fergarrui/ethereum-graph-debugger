import { Executor } from './Executor'
import { EVM } from '../EVM'
import { Operation } from '../../../bytecode/Operation'

export class Extcodecopy implements Executor {
  execute(op: Operation, evm: EVM) {
    evm.stack.pop()
    evm.stack.pop()
    evm.stack.pop()
    evm.stack.pop()
    // TODO push symbol to memory when it is supported
  }
}
