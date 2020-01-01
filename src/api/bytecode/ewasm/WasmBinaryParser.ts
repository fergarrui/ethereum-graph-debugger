import { injectable } from "inversify";
import { WasmBinary } from "./WasmBinary";
import { BytesReader } from "./BytesReader";
import { WasmSection, WasmTypeSectionPayload, WasmSectionPayload, WasmExportSectionPayload, WasmCodeSectionPayload } from "./WasmSection";
import { WasmSectionType, WasmType, WasmValueType, getWasmValueType, getExternalType } from "./wasmTypes";
import { FuncType } from "./FuncType";
import { FunctionBody, FunctionLocal } from "./FunctionBody";


@injectable()
export class WasmBinaryParser {

  private readonly WASM_MAGIC_NUMBER = '0061736d'
  private readonly WASM_V1 = '01000000'

  private sectionParsers: Map<number, Function> = new Map<number, Function>()

  constructor() {
    this.sectionParsers.set(WasmSectionType.Type, this.parseTypeSection)
    this.sectionParsers.set(WasmSectionType.Export, this.parseExportSection)
    this.sectionParsers.set(WasmSectionType.Code, this.parseCodeSection)
  }

  parse(binary: Buffer): WasmBinary {
    const reader: BytesReader = new BytesReader(binary)

    const magicNumberRead: string = reader.readBytesToHex(4)
    
    if(magicNumberRead !== this.WASM_MAGIC_NUMBER) {
      throw new Error(`WASM Magic number not found`)
    }
    const version = reader.readBytesToHex(4)

    if(version !== this.WASM_V1) {
      throw new Error(`WASM binary version=${version}, supported=${this.WASM_V1}`)
    }

    const wasmSections: WasmSection[] = []
    while(!reader.finished()) {
      const sectionId = reader.readBytesToNumber(1)
      const sectionType = WasmSectionType[sectionId.toString()]
      const payloadLength = reader.readVarUint32()
      const payloadData = reader.readBytes(payloadLength)
      const payloadHex = payloadData.toString('hex')
      const payload = this.parseSectionPayload(payloadData, sectionId)
      wasmSections.push({
        sectionType,
        payloadLength,
        payloadData,
        payloadHex,
        payload
      })
    }
    console.log(JSON.stringify(wasmSections))
    return
  }

  parseSectionPayload(payload: Buffer, sectionId: number): WasmSectionPayload {
    const sectionParser = this.sectionParsers.get(sectionId)
    if(!sectionParser) {
      return
    }
    return sectionParser(payload, this)
  }

  parseTypeSection(payload: Buffer, self: any): WasmTypeSectionPayload {
    const reader = new BytesReader(payload)

    // parsing Vector - refactor
    const sectionPayload: WasmTypeSectionPayload = {
      functions : []
    }
    const numberOfElements = reader.readVarUint32()
    let index = 0;
    while(index < numberOfElements) {
      const funcType: FuncType = self.parseFuncType(reader, index)
      sectionPayload.functions.push(funcType)
      index++
    }
    return sectionPayload
  }

  parseExportSection(payload: Buffer, self: any): WasmExportSectionPayload {
    const reader = new BytesReader(payload)
    // parsing exports vector
    const numberOfElements = reader.readVarUint32()
    let exportsCounter = 0
    const exportSection: WasmExportSectionPayload = {
      exports: []
    }
    while(exportsCounter < numberOfElements) {
      const strLength = reader.readVarUint32()
      const name = reader.readBytesToUtf8String(strLength)
      const exportKind = reader.readBytesToNumber(1)
      const kind = getExternalType(exportKind.toString())
      const index = reader.readVarUint32()
      exportSection.exports.push({
        name,
        index,
        kind
      })
      exportsCounter++
    }
    return exportSection
  }

  parseCodeSection(payload: Buffer, self: any): WasmCodeSectionPayload {
    const reader = new BytesReader(payload)
    const numberOfElements = reader.readVarUint32()
    const codeSection: WasmCodeSectionPayload = {
      functions: []
    }
    console.log(`ParsingCodeSection, noElements=${numberOfElements}`)
    let bodiesCounter = 0
    while(bodiesCounter < numberOfElements) {
      const functionBody = self.parseFunctionCode(reader)
      codeSection.functions.push(functionBody)
      bodiesCounter++
    }
    return codeSection
  }

  parseFunctionCode(reader: BytesReader): FunctionBody {
    
    const bodySize = reader.readVarUint32()
    const body = reader.readBytes(bodySize)
    return this.parseFunctionBody(body)
  }

  parseFunctionBody(body: Buffer): FunctionBody {
    const reader = new BytesReader(body)
    const numberOfLocals = reader.readVarUint32()
    const locals: FunctionLocal[] = []
    let localsCounter = 0
    while(localsCounter < numberOfLocals) {
      const count = reader.readVarUint32()
      const valueType = getWasmValueType(reader.readBytesToNumber(1).toString())
      
      locals.push({
        count,
        valueType
      })
      localsCounter++
    }
    const functionInstructions = reader.readBytes(body.length - reader.getPointer())
    const bytecodeHex = functionInstructions.toString('hex')
    return {
      bytecodeHex,
      locals
    }
  }

  parseFuncType(reader: BytesReader, index: number): FuncType {
    const typeByte = reader.readBytesToNumber(1)
    if(typeByte !== WasmType.FunctionType) {
      throw new Error(`Error parsing FuncType - type=${typeByte} not function `)
    }
    // reading params
    const params: WasmValueType[] = []
    const numParams = reader.readVarUint32()
    let paramsCounter = 0
    while(paramsCounter < numParams) {
      const paramByte = reader.readBytesToNumber(1)
      params.push(getWasmValueType(paramByte.toString()))
      paramsCounter++
    }
    // reading results
    const results: WasmValueType[] = []
    const numResults = reader.readVarUint32()
    let resultsCounter = 0
    while(resultsCounter < numResults) {
      const resultByte = reader.readBytesToNumber(1)
      results.push(getWasmValueType(resultByte.toString()))
      resultsCounter++
    }
    return {
      index,
      params,
      results
    }
  }

}
