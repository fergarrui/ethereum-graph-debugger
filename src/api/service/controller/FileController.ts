import { Route, Controller, Get, Path, Query } from 'tsoa'
import { provideSingleton, inject } from '../../../inversify/ioc'
import { ContractFile } from '../bean/ContractFile'
import { TYPES } from '../../../inversify/types'
import { FileService } from '../service/FileService'
import { logger } from '../../../Logger'

@Route('files')
@provideSingleton(FileController)
export class FileController extends Controller {
  constructor(@inject(TYPES.FileService) private fileService: FileService) {
    super()
  }

  @Get('{dir}')
  async findContractsInDir(@Path() dir: string, @Query('extension') extension: string): Promise<ContractFile[]> {
    try {
      const contracts = await this.fileService.findContractssWithExtension(dir, extension)
      if (contracts.length === 0) {
        throw new Error(`No contracts found at ${dir} with extension ${extension}`)
      }
      return contracts
    } catch (err) {
      logger.error(err)
      throw new Error(err.message)
    }
  }
}
