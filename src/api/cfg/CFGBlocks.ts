import { OperationBlock } from './OperationBlock'

export class CFGBlocks {
  blocks = {}

  push(block: OperationBlock, offset: number) {
    this.blocks[offset] = block
  }

  get(offset: number): OperationBlock {
    const block: OperationBlock = this.blocks[offset]
    if(!block) {
      for (const key of Object.keys(this.blocks)) {
        const b: OperationBlock = this.blocks[key]
        const found = b.operations.find(op => op.offset === offset)
        if (found) {
          return b
        }
      }
    }
    return block
  }

  keys(): number[] {
    return Object.keys(this.blocks).map(e => parseInt(e))
  }

  values(): OperationBlock[][] {
    return Object.values(this.blocks)
  }

  length(): number {
    return this.keys().length
  }
}
