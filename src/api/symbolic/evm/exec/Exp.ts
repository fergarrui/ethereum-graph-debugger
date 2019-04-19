import { Executor } from './Executor'
import { EVM } from '../EVM'
import { Operation } from '../../../bytecode/Operation'
import { Word } from '../Word'
import { Symbols } from '../Symbols'
import { UintUtils } from '../UintUtils'
let BN = require('bn.js')

export class Exp implements Executor {
  execute(op: Operation, evm: EVM) {
    const base = evm.stack.pop()
    const exp = evm.stack.pop()
    if (!base || !exp) {
      evm.stack.push(Word.createSymbolic(Symbols.UNKNOWN))
      return
    }
    if (!base.isSymbolic && !exp.isSymbolic) {
      const baseValue = base.value
      const expValue = exp.value

      let result = UintUtils.ONE
      if (!expValue.eq(UintUtils.ZERO)) {
        const mod = BN.red(UintUtils.TWO_POW_256)
        const b = baseValue.toRed(mod)
        result = b.redPow(expValue)
      }
      evm.stack.push(Word.createLiteral(result.toString(16)))
    } else {
      evm.stack.push(Word.createSymbolic(Symbols.UNKNOWN))
    }
  }
}
