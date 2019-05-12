import { injectable } from "inversify";
let solc = require('solc')
let fs = require('fs')
let nodePath = require('path')

@injectable()
export class ContractService {

  getAbi(contractName: string, source: string, path: string) {
    const contract = this.compileContract(contractName, source, path)
    return contract.abi
  }

  compileContract(contractName: string, source: string, path: string) {
    const compileJson = this.generateCompileObject(contractName, source, path)
    const compiledContract = JSON.parse(solc.compileStandardWrapper(JSON.stringify(compileJson)))
    const contractWithExt = `${contractName}.sol`
    const contract = compiledContract.contracts[contractWithExt][contractName]
    if (!contract) {
      throw new Error('Bad source code')
    }
    return contract
  }

  private generateCompileObject(contractName: string, content: string, path: string) {
    const sources = {}
    sources[`${contractName}.sol`] = {
      content: content
    }
    const filesChecked = []
    this.findImports(sources, content, path, filesChecked, path)
    const compileJson = {
      language: 'Solidity',
      sources,
      settings: {
        outputSelection: {
          '*': {
            '*': ['evm.bytecode', 'evm.legacyAssembly', 'evm.deployedBytecode', "abi"]
          }
        }
      }
    }
    return compileJson
  }
  private findImports(sources: any, content: string, path: string, filesChecked: string[], initialPath: string) {
    const regexp = /import "(.*)"|import '(.*)'/g
    const match = content.match(regexp)
    if (!match) {
      return
    }
    const matches = match.map(imp => {
      const splittedImp = imp.split('"')
      if (splittedImp.length < 2) {
        return imp.split("'")[1]
      } else {
        return splittedImp[1]
      }
    })

    for (const imp of matches) {
      let importFilePath = path
      if (!importFilePath.endsWith(nodePath.sep)) {
        importFilePath = importFilePath + nodePath.sep
      }
      importFilePath = nodePath.normalize(importFilePath + imp)
      const importPathRelative = nodePath
        .relative(initialPath, importFilePath)
        .replace('./', '')
        .replace('../', '')
        .replace(/^\./, '')

      const importContent = fs.readFileSync(importFilePath).toString()
      let sourceFileName = imp.replace('./', '').replace('../', '')
      if (sourceFileName.startsWith('.')) {
        sourceFileName = sourceFileName.substr(1, sourceFileName.length)
      }
      if (filesChecked.includes(importPathRelative)) {
        continue
      }
      filesChecked.push(importPathRelative)
      sources[importPathRelative] = {
        content: importContent
      }
      this.findImports(
        sources,
        importContent,
        nodePath.normalize(nodePath.dirname(importFilePath)),
        filesChecked,
        initialPath
      )
    }
  }
}