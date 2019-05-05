import { Route, Path, Controller, Get, Query } from 'tsoa'
import { provideSingleton } from '../../../inversify/ioc';
import { inject } from 'inversify';
import { TYPES } from '../../../inversify/types';
import { StorageRecover } from '../service/StorageRecover';
import { Web3Configuration } from '../../blockchain/Web3Configuration';
import { logger } from '../../../Logger'

@Route('storage')
@provideSingleton(StorageRecoverController)
export class StorageRecoverController extends Controller {

  constructor(@inject(TYPES.StorageRecover) private storageRecover: StorageRecover) {
    super()
  }

  @Get('{contractAddress}')
  async getStorage(
    @Path() contractAddress: string,
    @Query('startBlock') startBlock: number,
    @Query('endBlock') endBlock: number,
    @Query('blockchainHost') blockchainHost?: string,
    @Query('blockchainProtocol') blockchainProtocol?: string,
    @Query('blockchainBasicAuthUsername') blockchainBasicAuthUsername?: string,
    @Query('blockchainBasicAuthPassword') blockchainBasicAuthPassword?: string,
    @Query('existingStorage') existingStorage?: string
  ) {
    try {
      const config = {
        blockchainHost,
        blockchainProtocol,
        blockchainBasicAuthUsername,
        blockchainBasicAuthPassword
      } as Web3Configuration
      return this.storageRecover.recoverStorage(contractAddress, startBlock, endBlock, config, existingStorage)
    } catch (err) {
      logger.error(err)
      throw new Error(err.message)
    }
  }
}
