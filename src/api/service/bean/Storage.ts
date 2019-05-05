export class Storage {
  storage: any = {}

  setStorage(key: string, value: string, block: number, transactionHash: string, transactionIndex: number) {
    this.storage[key] = {
      value,
      transactionHash,
      block,
      transactionIndex
    } as StorageEntry
  }
}

export interface StorageEntry {
  value: string
  transactionHash: string
  block: number
  transactionIndex: number
}
