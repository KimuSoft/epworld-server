import { Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { ItemsService } from "./items.service";
import { ItemsParamDto } from "./items.dto";

@Controller("api/items")
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  // 물고기 인스턴스 조회
  @Get(":id")
  async getItem(@Param() { id }: ItemsParamDto) {
    const fish = await this.itemsService.findById(id);
    if (!fish) throw new NotFoundException("Fish not found");
    return fish;
  }
}
