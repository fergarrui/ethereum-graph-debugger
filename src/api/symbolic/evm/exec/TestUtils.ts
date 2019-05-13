import { Disassembler } from '../../../bytecode/Disassembler'
import { EthereumCFGCreator } from '../../../cfg/EthereumCFGCreator'
import { OpcodeExecutor } from './OpcodeExecutor'
import { Operation } from '../../../bytecode/Operation'
import { CFGBlocks } from '../../../cfg/CFGBlocks'
import { EVMExecutor } from '../EVMExecutor'
import { EVMDisassembler } from '../../../bytecode/EVMDisassembler';
import { ContractService } from '../../../service/service/ContractService';
import { Solc } from '../../../service/service/Solc';

export function createExecutor(
  disassembler: Disassembler,
  bytecode: string,
  cfgCreator: EthereumCFGCreator,
  opcodeExecutor: OpcodeExecutor
) {
  const ops: Operation[] = disassembler.disassembleBytecode(bytecode)
  const blocks: CFGBlocks = cfgCreator.divideBlocks(ops)
  return new EVMExecutor(blocks, opcodeExecutor)
}

export function createEVMDisassembler(): EVMDisassembler {
  return new EVMDisassembler(new ContractService(new Solc()))
}
