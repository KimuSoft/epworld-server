import { Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { FishService } from "./fish.service";

@Controller("api/fish")
export class FishController {
  constructor(private readonly fishService: FishService) {}

  // 물고기 인스턴스 조회
  @Get(":id")
  async getFish(@Param("id") id: string) {
    const fish = await this.fishService.findById(id);
    if (!fish) throw new NotFoundException("Fish not found");
    return fish;
  }
}
