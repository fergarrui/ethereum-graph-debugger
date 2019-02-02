import 'reflect-metadata'
import { CFGCreator } from './CFGCreator'
import { injectable } from 'inversify'
import { Operation } from '../bytecode/Operation'
import { OperationBlock } from './OperationBlock'
import { CFGBlocks } from './CFGBlocks'

@injectable()
export class EthereumCFGCreator implements CFGCreator {
  private readonly blockEnd = ['JUMPI', 'JUMP', 'STOP', 'REVERT', 'RETURN', 'INVALID']

  divideBlocks(ops: Operation[]): CFGBlocks {
    const blocks: CFGBlocks = new CFGBlocks()
    let startIndex = 0
    for (let i = 0; i < ops.length; i++) {
      const op: Operation = ops[i]
      if (this.blockEnd.includes(op.opcode.name) || i === ops.length - 1) {
        this.addNewBlock(ops, startIndex, i, blocks)
        startIndex = i + 1
      }
    }
    return blocks
  }

  private addNewBlock(ops: Operation[], startIndex: number, i: number, blocks: CFGBlocks) {
    const newBlockOps = ops.slice(startIndex, i + 1)
    const firstBlockOp = newBlockOps[0]
    const newBlock: OperationBlock = {
      offset: firstBlockOp.offset,
      operations: newBlockOps
    }
    blocks.push(newBlock, firstBlockOp.offset)
  }
}
