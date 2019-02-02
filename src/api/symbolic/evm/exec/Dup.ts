import { Executor } from './Executor'
import { EVM } from '../EVM'
import { Operation } from '../../../bytecode/Operation'

export class Dup implements Executor {
  execute(op: Operation, evm: EVM) {
    const index = parseInt(op.opcode.name.slice(3))
    const wordToDuplicate = evm.stack.get(index - 1)
    evm.stack.push(wordToDuplicate)
  }
}
