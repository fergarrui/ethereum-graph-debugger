import { injectable, inject } from "inversify";
import { TYPES } from "../../../inversify/types";
import { WasmBinaryParser } from "../../bytecode/ewasm/WasmBinaryParser";
import { WasmBinary } from "../../bytecode/ewasm/WasmBinary";
import { Web3Configuration } from "../../blockchain/Web3Configuration";
import { IWeb3 } from "../../blockchain/IWeb3";
import { Web3Instance } from "../../blockchain/Web3Instance";
import { findSection, WasmCodeSectionPayload } from "../../bytecode/ewasm/WasmSection";
import { WasmSectionType } from "../../bytecode/ewasm/wasmTypes";
import { WasmCFGCreator } from "../../bytecode/ewasm/cfg/WasmCFGCreator";
import { EWasmModule } from "../../bytecode/ewasm/EWasmModule";
import { WasmCallgraphCreator } from "../../bytecode/ewasm/callgraph/WasmCallgraphCreator";
import { WasmCallGraph } from "../../bytecode/ewasm/callgraph/WasmCallGraph";
import { WasmGraphVizService } from "../../bytecode/ewasm/callgraph/WasmGraphVizService";

const wabt = require("wabt")()
const commandExists = require('command-exists').sync
const execSync = require('child_process').execSync
var tmp = require('tmp')
var fs = require('fs')

@injectable()
export class EwasmService {

  constructor(
    @inject(TYPES.WasmBinaryParser) private wasmParser: WasmBinaryParser,
    @inject(TYPES.WasmCFGCreator) private cfgCreator: WasmCFGCreator,
    @inject(TYPES.WasmCallgraphCreator) private callGraphCreator: WasmCallgraphCreator,
    @inject(TYPES.WasmGraphVizService) private wasmGraphVizService: WasmGraphVizService
    ) {}

  analyze(codeInHex: string): EWasmModule {
    const wasm: Buffer = this.hexToBuffer(codeInHex)
    try {
      const binary: WasmBinary = this.wasmParser.parse(wasm)
      const callGraph: WasmCallGraph = this.callGraphCreator.createCallgraph(binary)
      const dotCallGraph: string = this.wasmGraphVizService.convertToDot(callGraph)

      // removeme
      // const sec = findSection(binary.sections, WasmSectionType.Code)
      // const pay: WasmCodeSectionPayload = sec.payload as WasmCodeSectionPayload
      // const f2 = pay.functions[2]
      // this.cfgCreator.createFunctionCfg(f2.opcodes)
      // end removeme
      return {
        binary,
        dotCallGraph
      }
    } catch (error) {
      console.log(error)
      throw new Error(`Error when analyzing ewasm bytecode: ${error.message}`)
    }
  }

  async analyzeAddress(address: string, config: Web3Configuration): Promise<EWasmModule> {
    const iWeb3: IWeb3 = new Web3Instance(config)
    const web3 = iWeb3.getInstance()
    let contractCode = await web3.eth.getCode(address)
    if(contractCode.startsWith('0x')) {
      contractCode = contractCode.substring(2, contractCode.length)
    }
    return this.analyze(contractCode)
  }

  wasmToWat(codeInHex: string): string {
    const codeArray: Uint8Array = this.HexToUint8Array(codeInHex)
    try {
      const modul = wabt.readWasm(codeArray, { readDebugNames: true });
      modul.applyNames();
      const wast = modul.toText({ foldExprs: false, inlineExport: false });
      return wast
    } catch (error) {
      console.log(error)
      throw new Error(`Error when parsing WASM: ${error.message}`)
    }
  }

  async decompile(codeInHex: string): Promise<string> {
    const codeArray = this.HexToUint8Array(codeInHex)
    // temporary using preinstalled tool. There are no NPM packages ready to be used
    if(!commandExists('wasm2c')) {
      throw new Error('wasm2c must be installed and added to $PATH')
    }
    const tmpObj = tmp.fileSync()
    const fileName = tmpObj.name
    fs.writeSync(tmpObj.fd, codeArray)

    const decompiledWasm = execSync(`wasm2c ${fileName}`)
    tmpObj.removeCallback();
    return decompiledWasm.toString('utf-8')
  }

  private hexToBuffer(codeInHex: string): Buffer {
    return Buffer.from(codeInHex, 'hex')
  }

  private HexToUint8Array(codeInHex: string): Uint8Array {
    return Uint8Array.from(Buffer.from(codeInHex, 'hex'));
  }
}
