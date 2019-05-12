import { TransactionBase } from "./TransactionBase";

export interface Transaction extends TransactionBase {
  blockHash: string;
  blockNumber: number;
  hash: string;
  to: string,
  input: string;
  nonce: number;
  transactionIndex: number;
}
