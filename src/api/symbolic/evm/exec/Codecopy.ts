import { Executor } from './Executor'
import { EVM } from '../EVM'
import { Operation } from '../../../bytecode/Operation'

export class Codecopy implements Executor {
  execute(op: Operation, evm: EVM) {
    evm.stack.pop()
    evm.stack.pop()
    evm.stack.pop()
    // TODO Push symbol when EVMMemory supports symbols
  }
}
