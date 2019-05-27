import { Route, Controller, Get, Query, Post, Path, Body } from 'tsoa'
import { provideSingleton, inject } from '../../../inversify/ioc';
import { TYPES } from '../../../inversify/types';
import { ContractService } from '../service/ContractService';
import { logger } from '../../../Logger';
import { RunContractFunctionRequest } from '../request/RunContractFunctionRequest';
import { Web3Configuration } from '../../blockchain/Web3Configuration';
import { DeployContractRequest } from '../request/DeployContractRequest';

@Route('contract')
@provideSingleton(ContractController)
export class ContractController extends Controller {

  constructor(
    @inject(TYPES.ContractService) private contractService: ContractService,
  ) {
    super()
  }

  @Get('abi')
  async getAbi(
    @Query('source') source: string,
    @Query('name') name: string,
    @Query('path') path: string
  ){
    try {
      const abi = this.contractService.getAbi(name, source, path)
      if (!abi) {
        throw new Error(`No abi found for contract ${name}`)
      }
      return abi
    } catch (err) {
      logger.error(err)
      throw new Error(err.message)
    }
  }

  @Post('deploy')
  async deploy(
    @Body() deployRequest: DeployContractRequest,
  ) {
    const config = {
      blockchainHost: deployRequest.blockchainHost,
      blockchainProtocol: deployRequest.blockchainProtocol,
      blockchainBasicAuthUsername: deployRequest.blockchainBasicAuthUsername,
      blockchainBasicAuthPassword: deployRequest.blockchainBasicAuthPassword
    } as Web3Configuration
    return this.contractService.deployContract(config, deployRequest.name, deployRequest.source, deployRequest.path, deployRequest)
  }

  @Post('run/{contractAddress}')
  async run(
    @Path() contractAddress: string,
    @Body() runFunction: RunContractFunctionRequest,
  )
  {
    const config = {
      blockchainHost: runFunction.blockchainHost,
      blockchainProtocol: runFunction.blockchainProtocol,
      blockchainBasicAuthUsername: runFunction.blockchainBasicAuthUsername,
      blockchainBasicAuthPassword: runFunction.blockchainBasicAuthPassword
    } as Web3Configuration

    return this.contractService.runFunction(
      config, 
      runFunction.abi, 
      runFunction.params, 
      contractAddress, 
      runFunction
    )
  }
}
