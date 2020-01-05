import { WasmCGF } from "./WasmCGF";

export class WasmCFGGraphVizService {

  convertToDot(cfg: WasmCGF): string {
    let graph = `digrapg " " {
      graph [splines=ortho]
      node[shape=box style=filled fontname="Courier"]

      ${this.createBody(cfg)}

    }` 

    return graph
  }

  private createBody(cfg: WasmCGF): string {
    let body = ''
    return body
  }
}
