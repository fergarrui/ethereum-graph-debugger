import { Executor } from './Executor'
import { EVM } from '../EVM'
import { Operation } from '../../../bytecode/Operation'
import { Word } from '../Word'

export class Pc implements Executor {
  execute(op: Operation, evm: EVM) {
    evm.stack.push(Word.createLiteral(op.offset.toString(16)))
  }
}
