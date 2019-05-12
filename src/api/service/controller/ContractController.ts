import { Route, Controller, Get, Query, Post, Path, Body } from 'tsoa'
import { provideSingleton, inject } from '../../../inversify/ioc';
import { TYPES } from '../../../inversify/types';
import { ContractService } from '../service/ContractService';
import { logger } from '../../../Logger';
import { RunContractFunctionRequest } from '../request/RunContractFunctionRequest';
import { IWeb3 } from '../../blockchain/IWeb3';
import { Web3Instance } from '../../blockchain/Web3Instance';
import { Web3Configuration } from '../../blockchain/Web3Configuration';

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

  @Post('run/{contractAddress}')
  async run(
    @Path() contractAddress: string,
    @Body() runFunction: RunContractFunctionRequest,
    @Query('blockchainHost') blockchainHost?: string,
    @Query('blockchainProtocol') blockchainProtocol?: string,
    @Query('blockchainBasicAuthUsername') blockchainBasicAuthUsername?: string,
    @Query('blockchainBasicAuthPassword') blockchainBasicAuthPassword?: string
  )
  {
    const config = {
      blockchainHost,
      blockchainProtocol,
      blockchainBasicAuthUsername,
      blockchainBasicAuthPassword
    } as Web3Configuration
    const iWeb3: IWeb3 = new Web3Instance(config)
    const web3 = iWeb3.getInstance()
    const functionCallEncoded = web3.eth.abi.encodeFunctionCall(runFunction.abi, runFunction.params)
    const accounts = await web3.eth.getAccounts()
    const receipt = await web3.eth.sendTransaction({
      to: contractAddress,
      from: runFunction.from || accounts[0],
      gas: runFunction.gas,
      gasPrice: runFunction.gasPrice,
      value: runFunction.value,
      input: functionCallEncoded
    })
    return receipt
  }
}
