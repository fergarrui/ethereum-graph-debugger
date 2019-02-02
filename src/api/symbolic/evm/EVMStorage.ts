import { Word } from './Word'

export class EVMStorage {
  storage = {}
  length

  store(slot: Word, value: Word) {
    if (!slot || !value) {
      return
    }
    if (slot.isSymbolic) {
      this.storage[slot.symbol] = value
    } else {
      this.storage[slot.value] = value
    }
  }

  load(slot: Word): Word {
    if (!slot) {
      return
    }
    if (slot.isSymbolic) {
      return this.storage[slot.symbol]
    } else {
      return this.storage[slot.value]
    }
  }
}
