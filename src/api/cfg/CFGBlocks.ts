import { OperationBlock } from './OperationBlock'

export class CFGBlocks {
  blocks = {}

  push(block: OperationBlock, offset: number) {
    this.blocks[offset] = block
  }

  get(offset: number): OperationBlock {
    return this.blocks[offset]
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
