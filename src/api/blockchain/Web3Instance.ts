import { IWeb3 } from './IWeb3'
import { Web3Configuration } from './Web3Configuration';
const Web3 = require('web3')

export class Web3Instance implements IWeb3 {
  web3Instance: any
  
  constructor(config: Web3Configuration) {
    const isEmpty = Object.values(config).every(x => (!x) || x === '')
    if (isEmpty) {
      this.web3Instance = new Web3('http://127.0.0.1:8545')  
    } else {
      const protocol = config.blockchainProtocol || 'http'
      const url = config.blockchainHost || '127.0.0.1:8545'
      let blockchainUrl = `${protocol}://`
      if (config.blockchainBasicAuthUsername && config.blockchainBasicAuthPassword) {
        blockchainUrl += `${config.blockchainBasicAuthUsername}:${config.blockchainBasicAuthPassword}@`
      }
      blockchainUrl += `${url}`
      this.web3Instance = new Web3(blockchainUrl)
    }
  }

  getInstance() {
    return this.web3Instance
  }
}
