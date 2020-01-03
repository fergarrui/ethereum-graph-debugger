import { Route, Controller, Post, Body, Get, Query, Path } from "tsoa";
import { provideSingleton, inject } from "../../../inversify/ioc";
import { StringBodyRequest } from "../request/StringBodyRequest";
import { TYPES } from "../../../inversify/types";
import { EwasmService } from "../service/EwasmService";
import { WasmBinary } from "../../bytecode/ewasm/WasmBinary";
import { Web3Configuration } from "../../blockchain/Web3Configuration";
import { logger } from '../../../Logger'

@Route('ewasm')
@provideSingleton(EwasmController)
export class EwasmController extends Controller {

  constructor(@inject(TYPES.EwasmService) private ewasmService: EwasmService) {
    super()
  }

  @Post('toWat')
  async wasmToWat(@Body() source: StringBodyRequest ): Promise<string> {
    try {
      return this.ewasmService.wasmToWat(source.request)
    } catch(error) {
      logger.error(error)
      throw new Error(error.message)
    }
  }

  @Post('decompile')
  async decompile(@Body() source: StringBodyRequest ): Promise<string> {
    try {
      return this.ewasmService.decompile(source.request)
    } catch(error) {
      logger.error(error)
      throw new Error(error.message)
    }
  }

  @Post('analyze')
  async analyze(@Body() source: StringBodyRequest ): Promise<WasmBinary> {
    try {
      return this.ewasmService.analyze(source.request)
    } catch(error) {
      logger.error(error)
      throw new Error(error.message)
    }
  }

  @Get('analyze/{address}')
  async analyzeAddress(
    @Path() address: string,
    @Query('blockchainHost') blockchainHost?: string,
    @Query('blockchainProtocol') blockchainProtocol?: string,
    @Query('blockchainBasicAuthUsername') blockchainBasicAuthUsername?: string,
    @Query('blockchainBasicAuthPassword') blockchainBasicAuthPassword?: string
  ): Promise<WasmBinary> {
    try {
      const config = {
        blockchainHost,
        blockchainProtocol,
        blockchainBasicAuthUsername,
        blockchainBasicAuthPassword
      } as Web3Configuration
      return this.ewasmService.analyzeAddress(address, config)
    } catch(error) {
      logger.error(error)
      throw new Error(error.message)
    }
  }
}
