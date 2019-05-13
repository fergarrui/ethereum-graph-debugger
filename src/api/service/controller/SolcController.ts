import { Controller, Route, Get, Post, Body } from "tsoa";
import { provideSingleton, inject } from "../../../inversify/ioc";
import { TYPES } from "../../../inversify/types";
import { Solc } from "../service/Solc";
import { SolcChangeVersionRequest } from "../request/SolcChangeVersionRequest";

@Route('solc')
@provideSingleton(SolcController)
export class SolcController extends Controller {

  constructor(
    @inject(TYPES.Solc) private solc: Solc
  ){
    super()
  }

  @Get()
  async getVersion(): Promise<string> {
    return this.solc.checkVersion()
  }

  @Get('list')
  async getAvailableVersions(): Promise<string[]> {
    return this.solc.listVersions()
  }

  @Post()
  async changeVersion(
    @Body() solcChangeVersionRequest: SolcChangeVersionRequest
    ) {
    return this.solc.changeVersion(solcChangeVersionRequest.version)
  }
}
