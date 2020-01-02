import { Route, Controller, Post, Body } from "tsoa";
import { provideSingleton, inject } from "../../../inversify/ioc";
import { StringBodyRequest } from "../request/StringBodyRequest";
import { TYPES } from "../../../inversify/types";
import { EwasmService } from "../service/EwasmService";
import { WasmBinary } from "../../bytecode/ewasm/WasmBinary";

@Route('ewasm')
@provideSingleton(EwasmController)
export class EwasmController extends Controller {

  constructor(@inject(TYPES.EwasmService) private ewasmService: EwasmService) {
    super()
  }

  @Post('toWat')
  async wasmToWat(@Body() source: StringBodyRequest ): Promise<string> {
    return this.ewasmService.wasmToWat(source.request)
  }

  @Post('decompile')
  async decompile(@Body() source: StringBodyRequest ): Promise<string> {
    return this.ewasmService.decompile(source.request)
  }

  @Post('analyze')
  async analyze(@Body() source: StringBodyRequest ): Promise<WasmBinary> {
    return this.ewasmService.analyze(source.request)
  }
}
