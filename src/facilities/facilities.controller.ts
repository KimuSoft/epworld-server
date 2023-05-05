import { Controller, Get, Param, Query } from "@nestjs/common";
import { FacilitiesService } from "./facilities.service";

// 임시 데이터셋 이후에 따로 빼야 함.
const FacilityData = [{ id: "PAR", name: "링파링", description: "링링파파링" }];

@Controller("api/facilities")
export class FacilitiesController {
  constructor(private readonly facilitiesService: FacilitiesService) {}

  // 시설 인스턴스 조회
  @Get(":id")
  async getFacility(@Param("id") id: string) {
    return this.facilitiesService.findById(id);
  }

  // 시설 데이터 조회
  @Get("data/:id")
  async getFacilityData(@Param("id") id: string) {
    return FacilityData.find((facility) => facility.id === id);
  }

  // 시설 데이터 검색
  @Get("data/search")
  async searchFacilityData(
    @Query("name") name: string,
    @Query("id") id: string
  ) {
    return FacilityData.find((facility) => facility.id === id);
  }
}
