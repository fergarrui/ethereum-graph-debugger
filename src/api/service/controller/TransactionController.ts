import { Route, Path, Controller, Get, Query } from 'tsoa'
import { provideSingleton, inject } from '../../../inversify/ioc'
import { TYPES } from '../../../inversify/types'
import { TransactionService } from '../service/TransactionService'
import { TransactionReceipt } from '../bean/TransactionReceipt'
import { logger } from '../../../Logger'
import { Web3Configuration } from 'src/api/blockchain/Web3Configuration';

@Route('tx')
@provideSingleton(TransactionController)
export class TransactionController extends Controller {
  constructor(@inject(TYPES.TransactionService) private transactionService: TransactionService) {
    super()
  }

  @Get('{tx}/receipt')
  async getReceipt(@Path() tx: string,
    @Query('blockchainHost') blockchainHost?: string,
    @Query('blockchainProtocol') blockchainProtocol?: string,
    @Query('blockchainBasicAuthUsername') blockchainBasicAuthUsername?: string,
    @Query('blockchainBasicAuthPassword') blockchainBasicAuthPassword?: string
  ): Promise<TransactionReceipt> {
    try {
      const config = {
        blockchainHost,
        blockchainProtocol,
        blockchainBasicAuthUsername,
        blockchainBasicAuthPassword
      } as Web3Configuration
      return this.transactionService.findTransactionReceipt(tx, config)
    } catch (err) {
      logger.error(err)
      throw new Error(err.message)
    }
  }
}
