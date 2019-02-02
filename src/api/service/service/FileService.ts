import { ContractFile } from '../bean/ContractFile'

export interface FileService {
  findContractssWithExtension(dir: string, extension: string): Promise<ContractFile[]>
}
