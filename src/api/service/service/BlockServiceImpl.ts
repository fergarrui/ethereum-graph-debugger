import { BlockService } from "./BlockService";
import { Block } from "../bean/Block";
import { Web3Configuration } from "../../blockchain/Web3Configuration";
import { IWeb3 } from "../../blockchain/IWeb3";
import { Web3Instance } from "../../blockchain/Web3Instance";
import { injectable } from 'inversify'
import { logger } from "../../../Logger";

@injectable()
export class BlockServiceImpl implements BlockService {
  
  async getBlock(blockNumber: number, config: Web3Configuration): Promise<Block> {
    const iWeb3: IWeb3 = new Web3Instance(config)
    const web3 = iWeb3.getInstance()
    const block: Block = await web3.eth.getBlock(blockNumber, false)
    if (!block) {
      logger.info('Block not found in node')
    }
    return block
  }
}
