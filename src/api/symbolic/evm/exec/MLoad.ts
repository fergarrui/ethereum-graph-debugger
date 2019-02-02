import { Executor } from './Executor'
import { EVM } from '../EVM'
import { Operation } from '../../../bytecode/Operation'
import { Symbols } from '../Symbols'
import { Word } from '../Word'

export class MLoad implements Executor {
  execute(op: Operation, evm: EVM) {
    const location = evm.stack.pop()
    // TODO support symbolic memory
    if (!location) {
      evm.stack.push(Word.createSymbolic(Symbols.UNKNOWN))
      return
    }
    if (!location.isSymbolic) {
      if (location.value.bitLength() > 53) {
        evm.stack.push(Word.createSymbolic(Symbols.UNKNOWN))
        return
      }
      const memoryValue = evm.memory.loadWord(location.value.toNumber())
      evm.stack.push(memoryValue)
    }
  }
}
