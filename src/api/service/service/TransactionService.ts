import { TransactionReceipt } from '../bean/TransactionReceipt'
import { DebugTrace } from '../../symbolic/evm/DebugTrace'
import { Web3Configuration } from 'src/api/blockchain/Web3Configuration';

export interface TransactionService {
  findTransactionReceipt(transactionHash: string, config: Web3Configuration): Promise<TransactionReceipt>
  findTransactionTrace(transactionHash: string, bytecode: string, config: Web3Configuration): Promise<DebugTrace>
}
