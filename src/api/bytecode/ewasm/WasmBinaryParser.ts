import { injectable } from "inversify";
import { WasmBinary } from "./WasmBinary";
import { BytesReader } from "./BytesReader";
import { WasmSection, WasmTypeSectionPayload, WasmSectionPayload, WasmExportSectionPayload, WasmCodeSectionPayload, WasmImportSectionPayload, WasmFunctionSectionPayload, findSection, WasmGlobalSectionPayload, findSectionPayload } from "./WasmSection";
import { WasmSectionType, WasmType, WasmValueType, getWasmValueType, getExternalType, WasmExternalKind } from "./wasmTypes";
import { FuncType, printSignature } from "./FuncType";
import { FunctionBody, FunctionLocal, formatOpcodes } from "./FunctionBody";
import { WasmOpcode, WasmOpcodeDefinition, WasmOpcodes, Immediate, BlockType } from "./WasmOpcodes";
import { OpcodeImmediateType } from "./OpcodeImmediateType";


@injectable()
export class WasmBinaryParser {

  private readonly WASM_MAGIC_NUMBER = '0061736d'
  private readonly WASM_V1 = '01000000'

  private sectionParsers: Map<number, Function> = new Map<number, Function>()

  constructor() {
    this.sectionParsers.set(WasmSectionType.Type, this.parseTypeSection)
    this.sectionParsers.set(WasmSectionType.Export, this.parseExportSection)
    this.sectionParsers.set(WasmSectionType.Code, this.parseCodeSection)
    this.sectionParsers.set(WasmSectionType.Import, this.parseImportSection)
    this.sectionParsers.set(WasmSectionType.Function, this.parseFunctionSection)
    this.sectionParsers.set(WasmSectionType.Global, this.parseGlobalSection)
  }

  parse(binary: Buffer): WasmBinary {
    const reader: BytesReader = new BytesReader(binary)

    const magicNumberRead: string = reader.readBytesToHex(4)
    
    if(magicNumberRead !== this.WASM_MAGIC_NUMBER) {
      throw new Error(`WASM Magic number not found: ${magicNumberRead}`)
    }
    const version = reader.readBytesToHex(4)

    if(version !== this.WASM_V1) {
      throw new Error(`WASM binary version=${version}, supported=${this.WASM_V1}`)
    }

    const sections: WasmSection[] = []
    while(!reader.finished()) {
      const sectionId = reader.readBytesToNumber(1)
      const sectionType = WasmSectionType[sectionId.toString()]
      const payloadLength = reader.readVarUint32()
      const payloadData = reader.readBytes(payloadLength)
      const payloadHex = payloadData.toString('hex')
      const payload = this.parseSectionPayload(payloadData, sectionId)
      sections.push({
        sectionType,
        payloadHex,
        payload
      })
    }
    const wasmBinary: WasmBinary = {
      sections
    };
    const wasmPostProcessed = this.postProcess(wasmBinary);
    return wasmPostProcessed
  }

  postProcess(wasmBinary: WasmBinary): WasmBinary {

    const functionSectionPayload: WasmFunctionSectionPayload = findSectionPayload<WasmFunctionSectionPayload>(wasmBinary.sections, WasmSectionType.Function)
    
    const typeSection = findSection(wasmBinary.sections, WasmSectionType.Type)
    const typeSectionPayload: WasmTypeSectionPayload = typeSection.payload as WasmTypeSectionPayload

    const codeSection = findSection(wasmBinary.sections, WasmSectionType.Code)
    const codeSectionPayload: WasmCodeSectionPayload = codeSection.payload as WasmCodeSectionPayload

    const exportSection = findSection(wasmBinary.sections, WasmSectionType.Export)
    const exportSectionPayload: WasmExportSectionPayload = exportSection.payload as WasmExportSectionPayload
    
    const importSection = findSection(wasmBinary.sections, WasmSectionType.Import)
    const importSectionPayload: WasmImportSectionPayload = importSection ? importSection.payload as WasmImportSectionPayload : {imports: []} as WasmImportSectionPayload

    // adding function signatures & name
    for (let i = 0; i < functionSectionPayload.functionsTypes.length; i++) {
      const fun = functionSectionPayload.functionsTypes[i]
      const funCode = codeSectionPayload.functions[i]
      const typ = typeSectionPayload.functions[fun]
      const signature = printSignature(i, typ)
      funCode.functionSignature = signature
      funCode.name = `func_${i}`
    }
    const numOfImports = importSectionPayload.imports.length
    // adding export names to functions
    for(const exp of exportSectionPayload.exports) {
      if(exp.kind !== getExternalType(WasmExternalKind.Function.toString())) {
        continue
      }
      const index = exp.index - numOfImports
      const fun = codeSectionPayload.functions[index]
      fun.exportedName = exp.name
    }
    // formatting opcodes
    for(const fun of codeSectionPayload.functions) {
      const formattedOpcodes = formatOpcodes(fun.opcodes, importSectionPayload, codeSectionPayload)
      fun.formattedOpcodes = formattedOpcodes
    }
    return wasmBinary
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
      const funcType: FuncType = self.parseFuncType(reader)
      sectionPayload.functions.push(funcType)
      index++
    }
    return sectionPayload
  }

  parseGlobalSection(payload: Buffer, self: any) : WasmGlobalSectionPayload {
    const reader = new BytesReader(payload)
    const globalsSection: WasmGlobalSectionPayload = {

    }
    const numberOfElements = reader.readVarUint32()
    let globalsCounter = 0
    while(globalsCounter < numberOfElements) {
      const globalType = reader.readBytesToNumber(1)
      globalsCounter++
    }
    return
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

  parseImportSection(payload: Buffer, self: any): WasmImportSectionPayload {
    const reader = new BytesReader(payload)
    const numberOfElements = reader.readVarUint32()
    let importsCounter = 0
    const importsSection: WasmImportSectionPayload = {
      imports: []
    }
    while(importsCounter < numberOfElements) {
      const moduleNameLength = reader.readVarUint32()
      const moduleName = reader.readBytesToUtf8String(moduleNameLength)
      const fieldNameLength = reader.readVarUint32()
      const fieldName = reader.readBytesToUtf8String(fieldNameLength)
      const importKind = reader.readBytesToNumber(1)
      const kind = getExternalType(importKind.toString())
      let kindType: any
      if (kind === getExternalType(WasmExternalKind.Function.toString())) {
        kindType = reader.readVarUint32()
      } else if (kind === getExternalType(WasmExternalKind.Table.toString())) {
        const tableElemType = reader.readVarUint32()
        const limits = self.parseLimits(reader)
        kindType = {
          tableElemType,
          limits
        }
      } else if (kind === getExternalType(WasmExternalKind.Table.toString())) {
        kindType = self.parseLimits(reader)
      } else if (kind === getExternalType(WasmExternalKind.Table.toString())) {
        const globalValType = reader.readBytesToNumber(1)
        const mutability = reader.readBytesToNumber(1)
        kindType = {
          globalValType,
          mutability
        }
      }
      
      importsSection.imports.push({
        moduleName,
        fieldName,
        kind,
        kindType
      })
      importsCounter++
    }
    return importsSection
  }

  // improve limits
  parseLimits(reader: BytesReader): any {
    const limitsHasMax = reader.readBytesToNumber(1)
    const limitMin = reader.readVarUint32()
    let limits: any = {
      limitMin
    }
    if(limitsHasMax === 1) {
      const limitMax = reader.readVarUint32()
      limits = {
        ...limits,
        limitMax
      }
    }
    return limits
  }

  parseFunctionSection(payload: Buffer, self: any): WasmFunctionSectionPayload {
    const reader = new BytesReader(payload)
    const numberOfElements = reader.readVarUint32()
    const functionSection: WasmFunctionSectionPayload = {
      functionsTypes: []
    }
    let functionsCounter = 0
    while(functionsCounter < numberOfElements) {
      const functionTypeIndex = reader.readVarUint32()
      functionSection.functionsTypes.push(functionTypeIndex)
      functionsCounter++
    }
    return functionSection
  }

  parseCodeSection(payload: Buffer, self: any): WasmCodeSectionPayload {
    const reader = new BytesReader(payload)
    const numberOfElements = reader.readVarUint32()
    const codeSection: WasmCodeSectionPayload = {
      functions: []
    }
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
    const bytecodeBuffer: Buffer = reader.readBytes(body.length - reader.getPointer())
    const opcodes: WasmOpcode[] = this.parseFunctionBytecode(bytecodeBuffer)
    const bytecodeHex: string = bytecodeBuffer.toString('hex')
    return {
      bytecodeHex,
      locals,
      opcodes
    }
  }

  parseFunctionBytecode(bytecode: Buffer): WasmOpcode[] {
    const reader = new BytesReader(bytecode)
    const opcodes: WasmOpcode[] = []
    let depth = 0
    let blockType: BlockType = BlockType.NONE
    let index = 0
    while(!reader.finished()) {
      const opcodeByte = reader.readBytesToNumber(1)
      const immediates: string[] = []
      const opcodeDefinition: WasmOpcodeDefinition = WasmOpcodes.getDefinition(opcodeByte)
      if(!opcodeDefinition) {
        throw new Error(`Opcode not implemented: ${opcodeByte} [${opcodeByte.toString(16)}]`)
      }
      for(const immediate of opcodeDefinition.immediates) {
        // TODO refactor this shit
        if (immediate.type === OpcodeImmediateType.U32) {
          const immediateValue = reader.readVarUint32()
          const valueFormatted = immediateValue < 0? `-0x${(immediateValue * -1).toString(16)}`: `0x${immediateValue.toString(16)}`
          immediates.push(valueFormatted)
        } else if (immediate.type === OpcodeImmediateType.I32) {
          const immediateValue = reader.readVarInt32()
          const valueFormatted = immediateValue < 0? `-0x${(immediateValue * -1).toString(16)}`: `0x${immediateValue.toString(16)}`
          immediates.push(valueFormatted)
        } else if (immediate.type === OpcodeImmediateType.I64) {
          const immediateValue = reader.readVarInt64()
          const valueFormatted = immediateValue < 0? `-0x${(immediateValue * -1).toString(16)}`: `0x${immediateValue.toString(16)}`
          immediates.push(valueFormatted)
        } else if (immediate.type === OpcodeImmediateType.BYTE) {
          const immediateValue = reader.readBytesToNumber(1)
          const valueFormatted = immediateValue < 0? `-0x${(immediateValue * -1).toString(16)}`: `0x${immediateValue.toString(16)}`
          immediates.push(valueFormatted)
        } else if (immediate.type === OpcodeImmediateType.VECTOR_U32) {
          const vectorLength = reader.readVarUint32()
          let vectorCounter = 0
          while(vectorCounter < vectorLength) {
            const immediateValue = reader.readVarUint32()
            const valueFormatted = immediateValue < 0? `-0x${(immediateValue * -1).toString(16)}`: `0x${immediateValue.toString(16)}`
            immediates.push(valueFormatted)
            vectorCounter++
          }
        }
      }

      const newOpcode = {
        index,
        opcode: opcodeDefinition,
        immediates,
        depth,
        blockType
      };
      opcodes.push(newOpcode)
      if(WasmOpcodes.isBlockEnd(newOpcode)) {
        depth--
      }
      if(WasmOpcodes.isBlockStart(newOpcode)) {
        depth++
      }
      index++      
    }
    return opcodes
  }

  parseFuncType(reader: BytesReader): FuncType {
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
      params,
      results
    }
  }

}
