import { WasmCallGraph } from "./WasmCallGraph";
import { injectable } from "inversify";

@injectable()
export class WasmGraphVizService {

  convertToDot(callGraph: WasmCallGraph): string {
    let graph = `digraph " " {
      graph [splines=ortho]
      node[shape=plain style=filled fontname="Courier"]
      `

    graph+= `
    ${this.createBody(callGraph)}
    }`
    console.log(graph)
    return graph
  }

  private createBody(callGraph: WasmCallGraph): string {
    let body = ''
    callGraph.functions.forEach((value, key) => {
      body += `${key} [label=${value.name}]
        ${this.createRelations(value.calling, key)}
        `
      
    })
    return body
  }

  private createRelations(calling: number[], index: number): string {
    let relations = ''
    relations += calling.map(c => `${index} -> ${c}`).join('\n')
    return relations
  }
}
