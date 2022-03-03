const TYPES = {
  Web3Instance: Symbol.for('Web3Instance'),
  FileService: Symbol.for('FileService'),
  TransactionService: Symbol.for('TransactionService'),
  Disassembler: Symbol.for('EVMDisassembler'),
  CFGCreator: Symbol.for('CFGCreator'),
  GraphVizService: Symbol.for('GraphVizService'),
  BlockService: Symbol.for('BlockService'),
  CFGService: Symbol.for('CFGService'),
  StorageRecover: Symbol.for('StorageRecover'),
  OpcodeExecutor: Symbol.for('OpcodeExecutor'),
  ContractService: Symbol.for('ContractService'),
  EwasmService: Symbol.for('EwasmService'),
  WasmBinaryParser: Symbol.for('WasmBinaryParser'),
  WasmCFGCreator: Symbol.for('WasmCFGCreator'),
  WasmCallgraphCreator: Symbol.for('WasmCallgraphCreator'),
  WasmCallGraphVizService: Symbol.for('WasmCallGraphVizService'),
  WasmCFGGraphVizService: Symbol.for('WasmCFGGraphVizService'),
  Solc: Symbol.for('Solc')
}

export { TYPES }
