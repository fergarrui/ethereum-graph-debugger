import { TransactionReceipt } from '../bean/TransactionReceipt'
import { DebugTrace } from '../../symbolic/evm/DebugTrace'
import { Web3Configuration } from 'src/api/blockchain/Web3Configuration';
import { Transaction } from '../bean/Transaction';

export interface TransactionService {
  findTransactionReceipt(transactionHash: string, config: Web3Configuration): Promise<TransactionReceipt>
  findTransaction(transactionHash: string, config: Web3Configuration): Promise<Transaction>
  findTransactionTrace(transactionHash: string, bytecode: string, config: Web3Configuration): Promise<DebugTrace>
  getTrace(transactionHash: string, config: Web3Configuration): Promise<DebugTrace>
}
