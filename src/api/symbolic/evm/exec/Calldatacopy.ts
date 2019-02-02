import { Executor } from './Executor'
import { EVM } from '../EVM'
import { Operation } from '../../../bytecode/Operation'

export class Calldatacopy implements Executor {
  execute(op: Operation, evm: EVM) {
    evm.stack.pop()
    evm.stack.pop()
    evm.stack.pop()
    // TODO write symbol in memory (memory doesn't support symbolic values yet)
  }
}
