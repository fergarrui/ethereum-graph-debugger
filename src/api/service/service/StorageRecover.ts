import { injectable, inject } from "inversify";
import { TYPES } from "../../../inversify/types";
import { Block } from "../bean/Block";
import { BlockService } from "./BlockService";
import { Web3Configuration } from "../../blockchain/Web3Configuration";
import { TransactionReceipt } from "../bean/TransactionReceipt";
import { TransactionService } from "./TransactionService";
import { Storage } from "../bean/Storage"
import { Transaction } from "../bean/Transaction";

@injectable()
export class StorageRecover {

  revertOpcodes = ['REVERT', 'INVALID']

  constructor(
    @inject(TYPES.BlockService) private blockService: BlockService,
    @inject(TYPES.TransactionService) private transactionService: TransactionService
  ){}

  async recoverStorage(contractAddress: string, startBlock: number, endBlock: number, config: Web3Configuration, existingStorage?: string): Promise<Storage> {
    let resultStorage: Storage = existingStorage? JSON.parse(existingStorage) : new Storage()
    for (let i = startBlock; i <= endBlock; i++) {
      const block: Block = await this.blockService.getBlock(i, config)
      if (block) {
        for( const transaction of block.transactions) {
          resultStorage = await this.processTransaction(transaction, contractAddress, config, resultStorage)
        }
      }
    }
    return resultStorage
  }

  private async processTransaction(transactionHash: string, contractAddress: string, config: Web3Configuration, existingStorage: Storage): Promise<Storage> {
    
    const receipt: TransactionReceipt = await this.transactionService.findTransactionReceipt(transactionHash, config)
    const transaction: Transaction = await this.transactionService.findTransaction(transactionHash, config)
    if (!this.isContractCreation(transaction) && transaction.to.toLowerCase() !== contractAddress.toLowerCase()) {
      return existingStorage
    }
    if (this.isContractCreation(transaction) && receipt.contractAddress.toLowerCase() !== contractAddress.toLowerCase()) {
      return existingStorage
    }
    const transactionTrace = await this.transactionService.getTrace(receipt.transactionHash, config)
    if (!transactionTrace || !transactionTrace.result) {
      throw new Error(`Transaction trace not valid for txHash=${receipt.transactionHash}`)
    }
    const lastLog = transactionTrace.result.structLogs[transactionTrace.result.structLogs.length-1]
    if (this.revertOpcodes.includes(lastLog.op)) {
      return existingStorage
    } else {
      for (const key of Object.keys(lastLog.storage)) {
        const value = lastLog.storage[key]
        existingStorage.setStorage(key, value, receipt.blockNumber, receipt.transactionHash, receipt.transactionIndex)
      }
    }
    return existingStorage
  }

  private isContractCreation(transaction: Transaction): boolean {
    return !transaction.to || transaction.to === '0x0'
  }
}
