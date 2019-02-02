import { Executor } from './Executor'
import { EVM } from '../EVM'
import { Operation } from '../../../bytecode/Operation'

export class Log implements Executor {
  execute(op: Operation, evm: EVM) {
    const index = parseInt(op.opcode.name.slice(3))
    const stackToRemove = index + 2
    let i = 1
    while (i <= stackToRemove) {
      evm.stack.pop()
      i++
    }
    // Don't need to store logs anywhere
  }
}
