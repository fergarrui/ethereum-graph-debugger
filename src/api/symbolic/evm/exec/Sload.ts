import { Executor } from './Executor'
import { EVM } from '../EVM'
import { Operation } from '../../../bytecode/Operation'
import { Word } from '../Word'
import { Symbols } from '../Symbols'

export class Sload implements Executor {
  execute(op: Operation, evm: EVM) {
    const slot = evm.stack.pop()
    if (!slot) {
      evm.stack.push(Word.createSymbolic(Symbols.UNKNOWN))
      return
    }
    let value = evm.storage.load(slot)
    if (!value) {
      // This only has sense during CFG creation
      value = Word.createSymbolic(Symbols.UNKNOWN)
    }
    evm.stack.push(value)
  }
}
