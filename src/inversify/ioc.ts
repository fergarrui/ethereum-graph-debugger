import { Container, inject, interfaces, decorate, injectable } from 'inversify'
import { autoProvide, makeProvideDecorator, makeFluentProvideDecorator } from 'inversify-binding-decorators'
import { Controller } from 'tsoa'
import { IWeb3 } from '../api/blockchain/IWeb3'
import { TYPES } from './types'
import { Web3Instance } from '../api/blockchain/Web3Instance'
import { FileServiceDefault } from '../api/service/service/FileServiceDefault'
import { FileService } from '../api/service/service/FileService'
import { TransactionService } from '../api/service/service/TransactionService'
import { Disassembler } from '../api/bytecode/Disassembler'
import { EVMDisassembler } from '../api/bytecode/EVMDisassembler'
import { CFGCreator } from '../api/cfg/CFGCreator'
import { EthereumCFGCreator } from '../api/cfg/EthereumCFGCreator'
import { TransactionServiceImpl } from '../api/service/service/TransactionServiceImpl'
import { GraphVizService } from '../api/cfg/GraphVizService'
import { CFGService } from '../api/service/service/CFGService'
import { OpcodeExecutor } from '../api/symbolic/evm/exec/OpcodeExecutor'
import { BlockService } from '../api/service/service/BlockService';
import { BlockServiceImpl } from '../api/service/service/BlockServiceImpl';
import { StorageRecover } from '../api/service/service/StorageRecover';
import { ContractService } from '../api/service/service/ContractService';
import { Solc } from '../api/service/service/Solc';
import { EwasmService } from '../api/service/service/EwasmService';
import { WasmBinaryParser } from '../api/bytecode/ewasm/WasmBinaryParser';
import { WasmCFGCreator } from '../api/bytecode/ewasm/cfg/WasmCFGCreator';
import { WasmCallgraphCreator } from '../api/bytecode/ewasm/callgraph/WasmCallgraphCreator';
import { WasmCallGraphVizService } from '../api/bytecode/ewasm/callgraph/WasmCallGraphVizService';
import { WasmCFGGraphVizService } from '../api/bytecode/ewasm/cfg/WasmCFGGraphVizService';

const iocContainer = new Container()
const provide = makeProvideDecorator(iocContainer)
const fluentProvider = makeFluentProvideDecorator(iocContainer)

decorate(injectable(), Controller)

iocContainer.bind<IWeb3>(TYPES.Web3Instance).to(Web3Instance)
iocContainer.bind<FileService>(TYPES.FileService).to(FileServiceDefault)
iocContainer.bind<TransactionService>(TYPES.TransactionService).to(TransactionServiceImpl)
iocContainer.bind<Disassembler>(TYPES.Disassembler).to(EVMDisassembler)
iocContainer.bind<CFGCreator>(TYPES.CFGCreator).to(EthereumCFGCreator)
iocContainer.bind<GraphVizService>(TYPES.GraphVizService).to(GraphVizService)
iocContainer.bind<CFGService>(TYPES.CFGService).to(CFGService)
iocContainer.bind<BlockService>(TYPES.BlockService).to(BlockServiceImpl)
iocContainer.bind<OpcodeExecutor>(TYPES.OpcodeExecutor).to(OpcodeExecutor)
iocContainer.bind<StorageRecover>(TYPES.StorageRecover).to(StorageRecover)
iocContainer.bind<ContractService>(TYPES.ContractService).to(ContractService)
iocContainer.bind<WasmBinaryParser>(TYPES.WasmBinaryParser).to(WasmBinaryParser)
iocContainer.bind<Solc>(TYPES.Solc).to(Solc)
iocContainer.bind<EwasmService>(TYPES.EwasmService).to(EwasmService)
iocContainer.bind<WasmCFGCreator>(TYPES.WasmCFGCreator).to(WasmCFGCreator)
iocContainer.bind<WasmCallgraphCreator>(TYPES.WasmCallgraphCreator).to(WasmCallgraphCreator)
iocContainer.bind<WasmCallGraphVizService>(TYPES.WasmCallGraphVizService).to(WasmCallGraphVizService)
iocContainer.bind<WasmCFGGraphVizService>(TYPES.WasmCFGGraphVizService).to(WasmCFGGraphVizService)

const provideNamed = (
  identifier: string | symbol | interfaces.Newable<any> | interfaces.Abstract<any>,
  name: string
) => {
  return fluentProvider(identifier)
    .whenTargetNamed(name)
    .done()
}

const provideSingleton = (identifier: string | symbol | interfaces.Newable<any> | interfaces.Abstract<any>) => {
  return fluentProvider(identifier)
    .inSingletonScope()
    .done()
}

export { iocContainer, autoProvide, provide, inject, provideSingleton, provideNamed }
