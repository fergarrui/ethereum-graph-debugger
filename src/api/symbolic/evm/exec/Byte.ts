import { Executor } from './Executor'
import { EVM } from '../EVM'
import { Operation } from '../../../bytecode/Operation'
import { Word } from '../Word'
import { Symbols } from '../Symbols'
let BN = require('bn.js')

export class Byte implements Executor {
  execute(op: Operation, evm: EVM) {
    const operand1 = evm.stack.pop()
    const operand2 = evm.stack.pop()
    if (!operand1 || !operand2) {
      evm.stack.push(Word.createSymbolic(Symbols.UNKNOWN))
      return
    }
    if (!operand1.isSymbolic && !operand2.isSymbolic) {
      const pos = operand1.value
      const word = operand2.value
      let result = new BN(0)
      if (!pos.gten(32)) {
        result = new BN(word.shrn((31 - pos.toNumber()) * 8).andln(0xff))
      }
      evm.stack.push(Word.createLiteral(result.toString(16)))
    } else {
      evm.stack.push(Word.createSymbolic(Symbols.UNKNOWN))
    }
  }
}
