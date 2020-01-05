import { WasmCallGraph } from "./WasmCallGraph";
import { injectable } from "inversify";

@injectable()
export class WasmGraphVizService {

  convertToDot(callGraph: WasmCallGraph): string {
    let graph = `digraph " " {
      graph [splines=ortho]
      node[shape=box style=filled fontname="Courier"]
      `

    graph+= `
    ${this.createBody(callGraph)}
    }`
    // console.log(graph)
    return graph
  }

  private createBody(callGraph: WasmCallGraph): string {
    let body = ''
    callGraph.nodes.forEach((node, key) => {
      body += `N${key} [label=${node.name}]
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
