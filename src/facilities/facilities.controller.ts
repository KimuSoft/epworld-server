import { Controller, Get, Param, Query, UsePipes } from "@nestjs/common"
import { FacilitiesService } from "./facilities.service"
import { ZodValidationPipe } from "nestjs-zod"
import { FacilitiesParamDto } from "./facilities.dto"
import { ApiOperation, ApiTags } from "@nestjs/swagger"

// 임시 데이터셋 이후에 따로 빼야 함.
const FacilityData = [{ id: "PAR", name: "링파링", description: "링링파파링" }]

@ApiTags("Facilities")
@Controller("api/facilities")
export class FacilitiesController {
  constructor(private readonly facilitiesService: FacilitiesService) {}

  @ApiOperation({
    summary: "시설 인스턴스 조회",
    description: "지어진 시설을 조회한다.",
  })
  @Get(":id")
  async getFacility(@Param() { id }: FacilitiesParamDto) {
    return this.facilitiesService.findById(id)
  }

  @ApiOperation({
    summary: "시설 종류 상세",
    description: "해당 ID의 시설 종류 정보를 조회한다.",
  })
  @Get("data/:id")
  async getFacilityData(@Param("id") id: string) {
    return FacilityData.find((facility) => facility.id === id)
  }

  @ApiOperation({
    summary: "시설 종류 검색",
    description: "시설 종류를 검색한다.",
  })
  @Get("data/search")
  async searchFacilityData(
    @Query("name") name: string,
    @Query("id") id: string
  ) {
    return FacilityData.find((facility) => facility.id === id)
  }
}
