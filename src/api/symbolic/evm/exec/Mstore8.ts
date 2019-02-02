import { Executor } from './Executor'
import { EVM } from '../EVM'
import { Operation } from '../../../bytecode/Operation'

export class MStore8 implements Executor {
  execute(op: Operation, evm: EVM) {
    const location = evm.stack.pop()
    const value = evm.stack.pop()
    if (!location || !value) {
      return
    }
    if (!location.isSymbolic && !value.isSymbolic) {
      evm.memory.writeByte(location.value.toNumber(), value)
    }
  }
}
