import { Executor } from './Executor'
import { EVM } from '../EVM'
import { Operation } from '../../../bytecode/Operation'
import { Word } from '../Word'
import { Symbols } from '../Symbols'
let BN = require('bn.js')

export class Signextend implements Executor {
  execute(op: Operation, evm: EVM) {
    const k = evm.stack.pop()
    const val = evm.stack.pop()
    if (!k || !val) {
      evm.stack.push(Word.createSymbolic(Symbols.UNKNOWN))
      return
    }
    if (!k.isSymbolic && !val.isSymbolic) {
      const valArray = val.value.toArrayLike(Buffer, 'be', 32)
      let kValue = k.value
      let extend = false

      if (kValue.lten(31)) {
        kValue = kValue.toNumber()
        if (valArray[31 - kValue] & 0x80) {
          extend = true
        }

        for (let i = 30 - kValue; i >= 0; i--) {
          valArray[i] = extend ? 0xff : 0
        }
      }
      evm.stack.push(Word.createLiteral(new BN(valArray).toString(16)))
    } else {
      evm.stack.push(Word.createSymbolic(Symbols.UNKNOWN))
    }
  }
}
