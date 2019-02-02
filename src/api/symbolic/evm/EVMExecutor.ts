import { EVM } from './EVM'
import { CFGBlocks } from '../../cfg/CFGBlocks'
import { OperationBlock } from '../../cfg/OperationBlock'
import { Opcodes } from '../../bytecode/Opcodes'
import { Operation } from '../../bytecode/Operation'
import { OpcodeExecutor } from './exec/OpcodeExecutor'
import { Executor } from './exec/Executor'

export class EVMExecutor {
  readonly NO_NEXT_BLOCK = ['JUMP', 'STOP', 'REVERT', 'RETURN', 'INVALID']
  evm: EVM
  blocks: CFGBlocks
  executor: OpcodeExecutor

  constructor(blocks: CFGBlocks, executor: OpcodeExecutor) {
    this.evm = new EVM()
    this.blocks = blocks
    this.executor = executor
  }

  run(offset: number) {
    const block: OperationBlock = this.blocks.get(offset)
    if (!block) {
      throw new Error(`Could not find block with offset ${offset}`)
    }
    this.runBlock(block)
    const nextBlocks: OperationBlock[] = this.findNextBlocks(block)
    for (const nextBlock of nextBlocks) {
      if (block.childA !== nextBlock.offset && block.childB !== nextBlock.offset) {
        if (!block.childA) {
          block.childA = nextBlock.offset
        } else if (!block.childB) {
          block.childB = nextBlock.offset
        }
      }
      if (nextBlock.offset !== 0) {
        this.run(nextBlock.offset)
      }
    }
  }

  private runBlock(block: OperationBlock) {
    for (const op of block.operations) {
      const executor: Executor = this.executor.ops[op.opcode.name]
      if (!executor) {
        throw new Error(`Operation not implemented: ${op.opcode.name}`)
      }
      executor.execute(op, this.evm)
    }
  }

  private findNextBlocks(block: OperationBlock): OperationBlock[] {
    const nextBlocks: OperationBlock[] = []
    const ops = block.operations
    const lastOp: Operation = ops[ops.length - 1]
    if (Opcodes.isJump(lastOp.opcode)) {
      const jumpLocation = this.evm.nextJumpLocation
      this.evm.nextJumpLocation = undefined
      if (jumpLocation && !jumpLocation.isSymbolic) {
        const locationBlock: OperationBlock = this.blocks.get(jumpLocation.value.toNumber())
        if (locationBlock) {
          nextBlocks.push(locationBlock)
        }
      }
    }
    if (!this.NO_NEXT_BLOCK.includes(lastOp.opcode.name)) {
      const nextBlock = this.blocks.get(lastOp.offset + 1)
      if (nextBlock) {
        nextBlocks.push(nextBlock)
      }
    }
    return nextBlocks
  }
}
