import { injectable, inject } from "inversify";
import { TYPES } from "../../../inversify/types";
import { WasmBinaryParser } from "../../bytecode/ewasm/WasmBinaryParser";

const wabt = require("wabt")()
const commandExists = require('command-exists').sync
const execSync = require('child_process').execSync
const decode = require("@webassemblyjs/wasm-parser").decode
var tmp = require('tmp')
var fs = require('fs')


@injectable()
export class EwasmService {

  constructor(@inject(TYPES.WasmBinaryParser) private wasmParser: WasmBinaryParser) {}

  analyze(codeInHex: string): EwasmDisassembledContract {
    const codeArray: Uint8Array = this.HexToUint8Array(codeInHex)
    try {
  
      

    } catch (error) {
      console.log(error)
      throw new Error(`Error when analyzing ewasm bytecode: ${error.message}`)
    }
  }

  // analyze(codeInHex: string): EwasmDisassembledContract {
  //   const codeArray: Uint8Array = this.HexToBinary(codeInHex)
  //   try {
  //     const ast = decode(codeArray)
  //     console.log(JSON.stringify(ast))
  //     if(!ast.body || ast.body.length === 0) {
  //       throw new Error(`Malformed bytecode: No body`)
  //     }
  //     if (ast.body.length > 1) {
  //       console.log('!! If this error is shown, bytecode is not supported yet')
  //       throw new Error(`Bytecode not supported: Multiple body`)
  //     }

  //     const bodyFields = ast.body[0].fields
      
  //     const functions: EwasmFunction[] = this.findFunctionsInAst(bodyFields, codeArray)
  //     const exports: EwasmExport[] = this.findExportsInAst(bodyFields, codeArray)
  //     const ewasmDisassembled: EwasmDisassembledContract = {
  //       functions,
  //       exports
  //     }
  //     return ewasmDisassembled
  //   } catch (error) {
  //     console.log(error)
  //     throw new Error(`Error when analyzing ewasm bytecode: ${error.message}`)
  //   }
  // }

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
  
  // private findExportsInAst(fields: any[], code: Uint8Array): EwasmExport[] {

  //   const exportFields = fields.filter(field => field.type === EwasmAstFieldType.ModuleExport)

  //   if(!exportFields || exportFields.length === 0) {
  //     return []
  //   }
  //   return exportFields.map(field => {
  //     return {
  //       name: field.name,
  //       type: field.descr.exportType,
  //       bodyInHex: this.sliceBytecode(code, field)
  //     } as EwasmExport
  //   })
  // }

  // private findFunctionsInAst(fields: any[], code: Uint8Array): EwasmFunction[] {
  //   const functionFields = fields.filter(field => field.type === EwasmAstFieldType.Func)
  //   console.log(functionFields)
  //   if(!functionFields || functionFields.length === 0) {
  //     console.log('nada')
  //     return []
  //   }

  //   return functionFields.map(fun => {
  //     return {
  //       name: fun.name.value,
  //       numericName: fun.name.numeric,
  //       params: fun.signature.params.map(param => param.valtype),
  //       results: fun.signature.results
  //     } as EwasmFunction
  //   })
  // }

  private hexToBuffer(codeInHex: string): Buffer {
    return Buffer.from(codeInHex, 'hex')
  }

  private HexToUint8Array(codeInHex: string): Uint8Array {
    return Uint8Array.from(Buffer.from(codeInHex, 'hex'));
  }

  // private sliceBytecode(code: Uint8Array, node: any): string {
  //   if(!node.loc) {
  //     return '0x'
  //   }
  //   return Buffer.from(code.slice(node.loc.start.column, node.loc.end.column)).toString('hex')
  // }
}
