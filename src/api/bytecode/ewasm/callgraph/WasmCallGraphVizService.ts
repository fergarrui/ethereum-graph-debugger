import { WasmCallGraph } from "./WasmCallGraph";
import { injectable } from "inversify";

@injectable()
export class WasmCallGraphVizService {

  convertToDot(callGraph: WasmCallGraph): string {
    let graph = `digraph " " {
      graph [splines=ortho]
      node[shape=box style=filled fillcolor="#2A2A2A" fontname="Courier"]
      `

    graph+= `
    ${this.createBody(callGraph)}
    }`
    return graph
  }

  private createBody(callGraph: WasmCallGraph): string {
    let body = ''
    callGraph.nodes.forEach((node, key) => {
      body += `N${key} [label=${node.name} fontcolor="#12cc12"]
        ${this.createRelations(key, node.callees)}
        `
    })
    return body
  }

  private createRelations(caller: string, callees: string[]): string {
    let relations = ''
    relations += callees.map(c => `N${caller} -> N${c}`).join('\n')
    return relations
  }
}
