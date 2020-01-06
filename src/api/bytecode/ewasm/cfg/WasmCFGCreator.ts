import { injectable } from "inversify";
import { WasmOpcode, WasmOpcodes } from "../WasmOpcodes";
import { WasmBinary } from "../WasmBinary";
import { WasmSection, findSection, WasmCodeSectionPayload } from "../WasmSection";
import { WasmSectionType } from "../wasmTypes";
import { WasmCFGBlock } from "./WasmCFGBlock";
import { WasmCFGGraphVizService } from "./WasmCFGGraphVizService";

@injectable()
export class WasmCFGCreator {

  createWasmCFG(wasm: WasmBinary) {
    const functionSection: WasmSection = findSection(wasm.sections, WasmSectionType.Code)
    const funPayload: WasmCodeSectionPayload = functionSection.payload as WasmCodeSectionPayload
    funPayload.functions.forEach((fun, index) => {
      // removeme
      if (index === 1) {
        this.createFunctionCfg(fun.opcodes, wasm)
      }
    })
  }

  createFunctionCfg(opcodes: WasmOpcode[], wasm: WasmBinary) {
    // split in blocks first
    const cfgBlocks: Map<number, WasmCFGBlock> = new Map()
    let startIndex = 0
    let index = 0
    for (const op of opcodes) {
      if(WasmOpcodes.isCfgBlockEnd(op)) {
        const subOpcodes = opcodes.slice(startIndex, index + 1)
        cfgBlocks.set(startIndex, {opcodes: subOpcodes, nextBlocks: []})
        startIndex = index+1
      } else if (WasmOpcodes.isLoop(op)) {
        const subOpcodes = opcodes.slice(startIndex, index)
        cfgBlocks.set(startIndex, {opcodes: subOpcodes, nextBlocks: []})
        startIndex = index
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
      } else if (lastOpcode.opcode.name === 'block') {
        value.nextBlocks.push(lastOpcode.index + 1)
      } else if (lastOpcode.opcode.name === 'br_if') {
        const brIfImmediate: number = parseInt(lastOpcode.immediates[0], 16);
        this.addBrNextBlocks(brIfImmediate, lastOpcode, opcodes, value, cfgBlocks);
        value.nextBlocks.push(lastOpcode.index + 1)
      } else if (lastOpcode.opcode.name === 'br') {
        const brImmediate: number = parseInt(lastOpcode.immediates[0], 16);
        this.addBrNextBlocks(brImmediate, lastOpcode, opcodes, value, cfgBlocks)
      } else if (lastOpcode.opcode.name === 'br_table') {
        const brTableImmediates: string[] = lastOpcode.immediates
        brTableImmediates.forEach(immediate => {
          const immediateNum: number = parseInt(immediate, 16)
          this.addBrNextBlocks(immediateNum, lastOpcode, opcodes, value, cfgBlocks)
        })
      } else if (lastOpcode.opcode.name === 'else') {
        value.nextBlocks.push(lastOpcode.index + 1)
      } else if (lastOpcode.opcode.name === 'if') {
        let nextOpcode = this.findNextOpcodeWithDepth(lastOpcode.index + 1, opcodes, lastOpcode.depth)
        const nextElse = this.findNextOpcodeWithDepthAndName(lastOpcode.index, opcodes, lastOpcode.depth+1, 'else')
        if (nextElse !== -1) {
          if (nextOpcode > nextElse) {
            nextOpcode = nextElse + 1
          }
        }
        value.nextBlocks.push(lastOpcode.index + 1)
        value.nextBlocks.push(nextOpcode)
      }
    })

    // console.log(JSON.stringify(Array.from(cfgBlocks.entries())))
    const a = new WasmCFGGraphVizService()
    a.convertToDot({cfgBlocks}, wasm)
  }

  private addBrNextBlocks(immediate: number, lastOpcode: WasmOpcode, opcodes: WasmOpcode[], value: WasmCFGBlock, cfgBlocks: Map<number, WasmCFGBlock>) {
    const target = lastOpcode.depth - immediate - 1;
    const wasmBlockIndex = this.findPreviousOpcodeWithDepth(lastOpcode.index, opcodes, target)
    const wasmBlock = opcodes[wasmBlockIndex]
    if(WasmOpcodes.isLoop(wasmBlock)) {
       const cfgKeys = Array.from(cfgBlocks.keys())
       if(cfgKeys.includes(wasmBlockIndex)) {
        value.nextBlocks.push(wasmBlockIndex);
       }
    } else {
      const nextIndex = this.findNextOpcodeWithDepth(lastOpcode.index, opcodes, target);
      value.nextBlocks.push(nextIndex);
    }
  }

  findNextOpcodeWithDepth(start: number, opcodes: WasmOpcode[], depth: number): number {
    for (let i = start; i < opcodes.length; i++) {
      const op = opcodes[i]
      if (op.depth === depth) {
        return op.index
      }
    }
    throw new Error(`[findNextOpcodeWithDepth] No destination was found start=${start}, depth=${depth}`)
  }

  findNextOpcodeWithDepthAndName(start: number, opcodes: WasmOpcode[], depth: number, name: string): number {
    for (let i = start; i < opcodes.length; i++) {
      const op = opcodes[i]
      if (op.depth === depth && op.opcode.name === name) {
        return op.index
      }
    }
    return -1
  }

  findPreviousOpcodeWithDepth(start: number, opcodes: WasmOpcode[], depth: number): number {
    for (let i = start; i >= 0; i--) {
      const op = opcodes[i]
      if (op.depth === depth) {
        return op.index
      }
    }
    throw new Error(`[findPreviousOpcodeWithDepth] No destination was found start=${start}, depth=${depth}`)
  }
}
