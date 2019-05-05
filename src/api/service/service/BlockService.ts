import { Block } from "../bean/Block";
import { Web3Configuration } from "../../blockchain/Web3Configuration";

export interface BlockService {
  getBlock(blockNumber: number, config: Web3Configuration): Promise<Block>
}
