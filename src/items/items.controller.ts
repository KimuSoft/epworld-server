import { Controller, Get, NotFoundException, Param } from "@nestjs/common"
import { ItemsService } from "./items.service"
import { ApiOperation, ApiTags } from "@nestjs/swagger"
import { ItemIdParamDto } from "./dto/item-id-param.dto"

@ApiTags("Items")
@Controller("api/items")
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @ApiOperation({
    summary: "낚은 물고기 조회",
    description: "낚은 물고기를 ID로 조회한다.",
  })
  @Get(":id")
  async getItem(@Param() { id }: ItemIdParamDto) {
    const fish = await this.itemsService.findById(id)
    if (!fish) throw new NotFoundException("Fish not found")
    return fish
  }
}
