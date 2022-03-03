export class WasmCallGraph {
  
  public nodes: Map<string, WasmCallGraphNode>

  constructor() {
    this.nodes = new Map()
  }

  addNode(index: number, name: string, nodeType: WasmGraphNodeType) {
    this.nodes.set(`${nodeType}_${index}`, {
      name,
      callees: []
    })
  }

  addRelation(indexCaller: number, indexCallee: number, calleeType: WasmGraphNodeType) {
    const caller = this.nodes.get(`${WasmGraphNodeType.FUNCTION}_${indexCaller}`)
    if (!caller.callees.includes(`${calleeType}_${indexCallee}`)) {
      caller.callees.push(`${calleeType}_${indexCallee}`)
    }
  }



}

export interface WasmCallGraphNode {
  name: string
  callees: string[]
}

export enum WasmGraphNodeType {
  FUNCTION,
  TYPE
}
