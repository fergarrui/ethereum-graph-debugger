import { injectable } from "inversify";
let solc = require('solc')
const request = require("request")

@injectable()
export class Solc {

  private readonly SOLC_VERSIONS_URL = "https://ethereum.github.io/solc-bin/bin/list.json"

  getInstance() {
    return solc
  }

  async changeVersion(version: string): Promise<any> {
    return new Promise((resolve, reject) => {
      solc.loadRemoteVersion(version, function(err, s) {
        if(err) {
          return reject(err)
        }
        solc = s
        return resolve(s.version())
      })
    })
  }

  async listVersions(): Promise<any> {
    return new Promise((resolve, reject) => {

      const prepareResponse = (body: any) => {
        const releases = body.releases
    
        return Object.keys(releases).map(release => {
          return {
            version: release,
            commit: releases[release].replace('soljson-', '').replace('.js', '')
          }
        })
      }

      request({
        url: this.SOLC_VERSIONS_URL,
        json: true
      }, function (error, response, body) {
        if (error) {
          reject(error)
        }
        if(response.statusCode === 200) {
          resolve(prepareResponse(body))
        }
      })
    })
  }

  checkVersion(): string {
    return solc.version()
  }

  checkSimpleVersion(): string {
    let version: string = solc.version()
    if (version.startsWith('v')) {
      version = version.substr(1, version.length)
    }
    const indexOfPlus = version.indexOf('+')
    return version.substr(0, indexOfPlus)
  }

  isVersion5OrAbove(): boolean {
    const version = this.checkSimpleVersion()
    const versionSplitted = version.split('.')
    const minor = versionSplitted[1]
    return parseInt(minor) >= 5
  }
}
