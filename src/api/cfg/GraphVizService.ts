import { injectable } from 'inversify'
import { CFGBlocks } from './CFGBlocks'
import { OperationBlock } from './OperationBlock'
import { Operation } from '../bytecode/Operation'
import { DebugTrace } from '../symbolic/evm/DebugTrace'

@injectable()
export class GraphVizService {
  createDotFromBlocks(blocks: CFGBlocks, trace: DebugTrace): string {
    return `digraph " " {
      graph [splines=ortho ranksep="2" nodesep="2"]
      rankdir=LR
      node [shape=plain fillcolor="#2A2A2A" style=filled fontname="Courier"]
      ${this.createLegend()}
      ${this.buildBody(blocks, trace)}
    }`
  }

  private createLegend() {
    return `
    subgraph cluster_legend {
      label="Legend";
      legend1 [label=< <TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0" CELLPADDING="4"><TR><TD COLSPAN="3"><font color="#ffffff">Not run in transaction</font></TD></TR><TR><TD><font color="#12cc12">0x3f</font></TD><TD ID="3f" HREF=" "><font color="#12cc12">JUMPDEST</font></TD></TR></TABLE> >]
      legend2 [label=< <TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0" CELLPADDING="4"><TR><TD COLSPAN="3"><font color="#ffffff">Run in transaction</font></TD></TR><TR><TD><font color="#ff1020">0x0</font></TD><TD><font color="#ff1020">PUSH1</font></TD><TD><font color="#ff1020">0x80</font></TD></TR></TABLE> >]
      legend3 [label=< <TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0" CELLPADDING="4"><TR><TD COLSPAN="3"><font color="#ffffff">Run in transaction</font></TD></TR><TR><TD COLSPAN="3"><font color="#ffffff">Belongs to a loop</font></TD></TR><TR><TD><font color="#CD950C">0x3f</font></TD><TD ID="3f" HREF=" "><font color="#CD950C">JUMPDEST</font></TD></TR></TABLE> >]
    }
    `
  }

  private buildBody(blocks: CFGBlocks, trace: DebugTrace): string {
    let body: string = ''
    blocks.keys().forEach(key => {
      const block = blocks.get(key)
      body += `/* START block ${block.offset} */`
      body += `${block.offset} [label=${this.buildLabel(block.operations, trace)}]`
      body += this.buildRelations(block)
      body += `/* END block ${block.offset} */`
    })
    return body
  }

  private buildLabel(operations: Operation[], trace: DebugTrace): string {
    let ops = '< <TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0" CELLPADDING="4">'
    for (const op of operations) {
      let fontColor = '#12cc12'
      if (trace && this.isOperationInTrace(op, trace)) {
        fontColor = '#ff1020'
      }
      ops += `<TR>`
      ops += `<TD ID="${op.offset.toString(16)}" HREF=" "><font color="${fontColor}">0x${op.offset.toString(
        16
      )}</font></TD><TD ID="${op.offset.toString(16)}" HREF=" "><font color="${fontColor}">${
        op.opcode.name
      }</font></TD>`
      if (op.opcode.name.startsWith('PUSH')) {
        ops += `<TD ID="${op.offset.toString(16)}" HREF=" "><font color="${fontColor}">0x${op.argument.toString(
          16
        )}</font></TD>`
      }
      ops += `</TR>`
    }
    ops += '</TABLE> >'
    return ops
  }

  private isOperationInTrace(op: Operation, trace: DebugTrace): boolean {
    return trace.result.structLogs.find(element => element.pc === op.offset) !== undefined
  }

  private buildRelations(block: OperationBlock): string {
    let relations = ''
    if (block.childA) {
      relations += `${block.offset} -> ${block.childA} `
    }
    if (block.childB) {
      relations += `${block.offset} -> ${block.childB} `
    }
    return relations
  }
}