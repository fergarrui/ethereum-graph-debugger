import { EVMStack } from './EVMStack'
import { EVMStorage } from './EVMStorage'
import { EVMMemory } from './EVMMemory'
import { Word } from './Word'

export class EVM {
  stack: EVMStack
  storage: EVMStorage
  memory: EVMMemory
  nextJumpLocation: Word

  constructor() {
    this.stack = new EVMStack()
    this.storage = new EVMStorage()
    this.memory = new EVMMemory(64)
  }
}
