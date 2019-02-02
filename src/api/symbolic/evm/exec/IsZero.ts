import { Executor } from './Executor'
import { EVM } from '../EVM'
import { Operation } from '../../../bytecode/Operation'
import { Word } from '../Word'
import { Symbols } from '../Symbols'

export class IsZero implements Executor {
  execute(op: Operation, evm: EVM) {
    const value = evm.stack.pop()
    if (!value) {
      evm.stack.push(Word.createSymbolic(Symbols.UNKNOWN))
      return
    }
    if (!value.isSymbolic) {
      if (value.value.isZero()) {
        evm.stack.push(Word.createLiteral('01'))
      } else {
        evm.stack.push(Word.createLiteral('00'))
      }
    } else {
      evm.stack.push(Word.createSymbolic(Symbols.UNKNOWN))
    }
  }
}
