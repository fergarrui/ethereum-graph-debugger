import { injectable, inject } from "inversify";
import { TYPES } from "../../../inversify/types";
import { WasmBinaryParser } from "../../bytecode/ewasm/WasmBinaryParser";
import { WasmBinary } from "../../bytecode/ewasm/WasmBinary";

const wabt = require("wabt")()
const commandExists = require('command-exists').sync
const execSync = require('child_process').execSync
var tmp = require('tmp')
var fs = require('fs')

@injectable()
export class EwasmService {

  constructor(@inject(TYPES.WasmBinaryParser) private wasmParser: WasmBinaryParser) {}

  analyze(codeInHex: string): WasmBinary {
    const wasm: Buffer = this.hexToBuffer(codeInHex)
    try {
      const binary: WasmBinary = this.wasmParser.parse(wasm)
      return binary
    } catch (error) {
      console.log(error)
      throw new Error(`Error when analyzing ewasm bytecode: ${error.message}`)
    }
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
    console.log(`Created temp file: ${fileName}`)
    fs.writeSync(tmpObj.fd, codeArray)

    const decompiledWasm = execSync(`wasm2c ${fileName}`)
    tmpObj.removeCallback();
    console.log(decompiledWasm.toString('utf-8'))
    return decompiledWasm.toString('utf-8')
  }

  private hexToBuffer(codeInHex: string): Buffer {
    return Buffer.from(codeInHex, 'hex')
  }

  private HexToUint8Array(codeInHex: string): Uint8Array {
    return Uint8Array.from(Buffer.from(codeInHex, 'hex'));
  }
}
