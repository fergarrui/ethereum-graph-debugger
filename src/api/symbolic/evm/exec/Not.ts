import { Executor } from './Executor'
import { EVM } from '../EVM'
import { Operation } from '../../../bytecode/Operation'
import { Word } from '../Word'
import { Symbols } from '../Symbols'

export class Not implements Executor {
  execute(op: Operation, evm: EVM) {
    const operand1 = evm.stack.pop()
    if (!operand1) {
      evm.stack.push(Word.createSymbolic(Symbols.UNKNOWN))
      return
    }
    if (!operand1.isSymbolic) {
      const op1Value = operand1.value
      let result = op1Value.notn(256)
      evm.stack.push(Word.createLiteral(result.toString(16)))
    } else {
      evm.stack.push(Word.createSymbolic(Symbols.UNKNOWN))
    }
  }
}
