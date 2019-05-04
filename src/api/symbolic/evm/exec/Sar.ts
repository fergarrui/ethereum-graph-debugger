import { Executor } from './Executor'
import { EVM } from '../EVM'
import { Operation } from '../../../bytecode/Operation'
import { Word } from '../Word'
import { Symbols } from '../Symbols'
import { UintUtils } from '../UintUtils';

export class Sar implements Executor {
  execute(op: Operation, evm: EVM) {
    const operand1 = evm.stack.pop()
    const operand2 = evm.stack.pop()
    if (!operand1 || !operand2) {
      evm.stack.push(Word.createSymbolic(Symbols.UNKNOWN))
      return
    }
    if (!operand1.isSymbolic && !operand2.isSymbolic) {
      const op1Value = operand1.value
      const op2Value = operand2.value

      let result
      const isSigned = op2Value.testn(255)
      if(op1Value.gten(256)) {
        if (isSigned) {
          result = UintUtils.MAX_INTEGER
        } else {
          result = UintUtils.ZERO
        }
        evm.stack.push(Word.createLiteral(result.toString(16)))
        return  
      }

      const temp = op2Value.shrn(op1Value.toNumber())
      if (isSigned) {
        const shifted = 255 - op1Value.toNumber()
        const mask = UintUtils.MAX_INTEGER.shrn(shifted).shln(shifted)
        result = temp.ior(mask)
      } else {
        result = temp
      }

      evm.stack.push(Word.createLiteral(result.toString(16)))
    } else {
      evm.stack.push(Word.createSymbolic(Symbols.UNKNOWN))
    }
  }
}
