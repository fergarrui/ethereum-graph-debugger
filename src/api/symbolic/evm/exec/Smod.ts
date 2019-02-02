import { Executor } from './Executor'
import { EVM } from '../EVM'
import { Operation } from '../../../bytecode/Operation'
import { Word } from '../Word'
import { Symbols } from '../Symbols'
import { UintUtils } from '../UintUtils'

export class Smod implements Executor {
  execute(op: Operation, evm: EVM) {
    const operand1 = evm.stack.pop()
    const operand2 = evm.stack.pop()
    if (!operand1 || !operand2) {
      evm.stack.push(Word.createSymbolic(Symbols.UNKNOWN))
      return
    }
    if (!operand1.isSymbolic && !operand2.isSymbolic) {
      if (operand2.value.eq(UintUtils.ZERO)) {
        evm.stack.push(Word.createLiteral('00'))
      } else {
        const a = operand1.value.fromTwos(256)
        const b = operand2.value.fromTwos(256)
        let result = a.abs().mod(b.abs())
        if (a.isNeg()) {
          result = result.ineg()
        }
        evm.stack.push(Word.createLiteral(result.toTwos(256).toString(16)))
      }
    } else {
      evm.stack.push(Word.createSymbolic(Symbols.UNKNOWN))
    }
  }
}
