import { ContractFile } from '../bean/ContractFile'

export interface FileService {
  findContractssWithExtension(dir: string, extension: string): Promise<ContractFile[]>
  saveFile(dir: string, name: string, content: string)
}
