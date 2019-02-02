import 'reflect-metadata'

import { Executor } from './Executor'
import { EVM } from '../EVM'
import { Word } from '../Word'
import { Operation } from '../../../bytecode/Operation'

export class Push implements Executor {
  execute(op: Operation, evm: EVM) {
    const word: Word = {
      isSymbolic: false,
      value: op.argument
    }
    evm.stack.push(word)
  }
}
