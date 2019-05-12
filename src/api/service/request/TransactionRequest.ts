import { TransactionBase } from "../bean/TransactionBase";

export interface TransactionRequest extends TransactionBase {
  blockchainHost?: string,
  blockchainProtocol?: string,
  blockchainBasicAuthUsername?: string,
  blockchainBasicAuthPassword?: string
}
