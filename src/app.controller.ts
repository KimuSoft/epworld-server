import { Controller, Get } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";

@Controller()
export class AppController {
  @ApiOperation({
    summary: "핑퐁",
    description: "딱히 존재의의는 없다.",
  })
  @Get("ping")
  ping() {
    return "pong";
  }
}
