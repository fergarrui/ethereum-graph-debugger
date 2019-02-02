import { Executor } from './Executor'
import { EVM } from '../EVM'
import { Operation } from '../../../bytecode/Operation'

export class Swap implements Executor {
  execute(op: Operation, evm: EVM) {
    const index = parseInt(op.opcode.name.slice(4))
    const stack0 = evm.stack.get(0)
    const stackIndex = evm.stack.get(index)
    evm.stack.put(0, stackIndex)
    evm.stack.put(index, stack0)
  }
}
