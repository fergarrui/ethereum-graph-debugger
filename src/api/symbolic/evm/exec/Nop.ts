import { Executor } from './Executor'
import { EVM } from '../EVM'
import { Operation } from '../../../bytecode/Operation'

export class Nop implements Executor {
  execute(op: Operation, evm: EVM) {}
}
