import { injectable } from "inversify";
import { WasmOpcode, WasmOpcodes } from "../WasmOpcodes";
import { WasmBinary } from "../WasmBinary";
import { WasmSection, findSection, WasmCodeSectionPayload } from "../WasmSection";
import { WasmSectionType } from "../wasmTypes";
import { WasmCFGBlock } from "./WasmCFGBlock";

@injectable()
export class WasmCFGCreator {

  createWasmCFG(wasm: WasmBinary) {
    const functionSection: WasmSection = findSection(wasm.sections, WasmSectionType.Code)
    const funPayload: WasmCodeSectionPayload = functionSection.payload as WasmCodeSectionPayload
    funPayload.functions.forEach((fun, index) => {
      // removeme
      if (index === 0) {
        this.createFunctionCfg(fun.opcodes)
      }
    })
  }

  createFunctionCfg(opcodes: WasmOpcode[]) {
    // split in blocks first
    const cfgBlocks: Map<number, WasmCFGBlock> = new Map()
    let startIndex = 0
    let index = 0
    for (const op of opcodes) {
      if(WasmOpcodes.isCfgBlockEnd(op)) {
        const subOpcodes = opcodes.slice(startIndex, index + 1)
        cfgBlocks.set(startIndex, {opcodes: subOpcodes, nextBlocks: []})
        startIndex = index+1
      }
      index++
    }
    // calculate relations
    cfgBlocks.forEach((value: WasmCFGBlock, key: number) => {
      const lastOpcode = value.opcodes[value.opcodes.length-1]
      // if it is the last opcode, do nothing
      if(lastOpcode.index === opcodes[opcodes.length-1].index) {
        return
      }
      if (lastOpcode.opcode.name === 'end') {
        value.nextBlocks.push(lastOpcode.index + 1)
      } else if (lastOpcode.opcode.name === 'br_if') {
        const brIfImmediate: number = parseInt(lastOpcode.immediates[0], 16)
        const target = brIfImmediate - 1
        const nextIndex = this.findNextOpcodeWithDepth(lastOpcode.index, opcodes, target)
        value.nextBlocks.push(lastOpcode.index + 1)
        value.nextBlocks.push(nextIndex)
      } else if (lastOpcode.opcode.name === 'br') {
        const brImmediate: number = parseInt(lastOpcode.immediates[0], 16)
        const target = brImmediate - 1
        const nextIndex = this.findNextOpcodeWithDepth(lastOpcode.index, opcodes, target)
        value.nextBlocks.push(lastOpcode.index + 1)
        value.nextBlocks.push(nextIndex)
      } else if (lastOpcode.opcode.name === 'br_table') {
        const brTableImmediates: string[] = lastOpcode.immediates
        brTableImmediates.forEach((immediate, index) => {
          const immediateNum: number = parseInt(immediate, 16)
          let target = immediateNum - 1
          if (index === brTableImmediates.length - 1) {
            target = immediateNum
          }
          const nextIndex = this.findNextOpcodeWithDepth(lastOpcode.index, opcodes, target)
          value.nextBlocks.push(nextIndex)
        })
      }
    })

    console.log(JSON.stringify(Array.from(cfgBlocks.entries())))
  }

  findNextOpcodeWithDepth(start: number, opcodes: WasmOpcode[], depth: number): number {
    for (let i = start; i < opcodes.length; i++) {
      const op = opcodes[i]
      if (op.depth === depth) {
        return op.index
      }
    }
    throw new Error(`No destination was found start=${start}, depth=${depth}`)
  }
}
