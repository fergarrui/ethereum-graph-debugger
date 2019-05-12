export interface TransactionRequest {
  from?: string,
  gas?: number,
  gasPrice?: number,
  value?: number,
  blockchainHost?: string,
  blockchainProtocol?: string,
  blockchainBasicAuthUsername?: string,
  blockchainBasicAuthPassword?: string
}
