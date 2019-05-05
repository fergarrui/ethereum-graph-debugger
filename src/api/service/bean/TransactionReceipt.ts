export interface TransactionReceipt {
  transactionHash: string
  data: string
  to: string
  from: string
  blockNumber: number
  transactionIndex: number
  contractAddress: string
}
