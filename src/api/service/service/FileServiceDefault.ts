import { FileService } from './FileService'
import { ContractFile } from '../bean/ContractFile'
import { injectable } from 'inversify'
var recursive = require('recursive-readdir')
var path = require('path')
var fs = require('fs')

@injectable()
export class FileServiceDefault implements FileService {
  async findContractssWithExtension(dir: string, extension: string): Promise<ContractFile[]> {
    const files = await recursive(dir, [`!*.${extension}`])

    return await files
      .map(file => {
        const dirName = path.dirname(file)
        const fileContent = fs.readFileSync(file, 'utf8')
        return {
          name: path.basename(file),
          code: fileContent,
          path: dirName
        } as ContractFile
      })
      .sort((a, b) => (a.name > b.name ? 1 : -1))
  }
}
