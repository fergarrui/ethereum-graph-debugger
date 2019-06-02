import { Route, Controller, Get, Path, Query, Post, Body } from 'tsoa'
import { provideSingleton, inject } from '../../../inversify/ioc'
import { ContractFile } from '../bean/ContractFile'
import { TYPES } from '../../../inversify/types'
import { FileService } from '../service/FileService'
import { logger } from '../../../Logger'
import { SaveFileRequest } from '../request/SaveFileRequest';

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

  @Post()
  async saveFile(@Body() saveFileRequest: SaveFileRequest) {
    try {
      await this.fileService.saveFile(saveFileRequest.path, saveFileRequest.name, saveFileRequest.content)
    } catch (err) {
      logger.error(err)
      throw new Error(err.message)
    }
  }
}
