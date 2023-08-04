import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from "@nestjs/common"
import { PlacesService } from "./places.service"
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger"
import { FacilitiesDto } from "../facilities/entities/facility.entity"
import { Auth } from "../auth/auth.decorator"
import { EpRequest } from "../types"
import { CreatePlaceDto } from "./dto/create-place.dto"
import { PlaceIdParamDto } from "./dto/place-id-param.dto"
import { UpdatePlaceDto } from "./dto/update-place.dto"
import { BuyPlaceDto } from "./dto/buy-place.dto"
import { DestroyFacilityParamDto } from "./dto/destroy-facility-param.dto"
import { PlaceEntity } from "./place.entity"
import { SearchPlaceQueryDto } from "./dto/search-place-query.dto"

@ApiTags("Places")
@Controller("api/places")
export class PlacesController {
  constructor(private readonly placeService: PlacesService) {}

  @ApiOperation({
    summary: "낚시터 검색",
    description: "낚시터를 검색합니다.",
  })
  @Get()
  async searchPlaces(@Query() searchPlaceDto: SearchPlaceQueryDto) {
    return this.placeService.searchPlaces(searchPlaceDto)
  }

  @ApiOperation({
    summary: "낚시터 생성",
    description: "공식 디스코드 봇 전용. 낚시터를 생성할 수 있다.",
  })
  @Post()
  @Auth({ admin: true })
  async createPlace(
    @Request() req: EpRequest,
    @Body() createPlaceDto: CreatePlaceDto
  ): Promise<PlaceEntity> {
    return this.placeService.createPlace(req.user.id, createPlaceDto)
  }

  @ApiOperation({
    summary: "낚시터 조회",
    description: "낚시터 ID로 해당 낚시터의 정보를 불러온다.",
  })
  @Get(":id")
  @ApiParam({ name: "id", description: "낚시터 ID", type: "string" })
  async getPlace(@Param() { id }: PlaceIdParamDto): Promise<PlaceEntity> {
    const place = await this.placeService.findPlaceById(id)
    if (!place) throw new NotFoundException("Place not found")

    return place
  }

  @ApiOperation({
    summary: "낚시터 수정",
    description:
      "낚시터의 정보를 수정한다. 일부 정보는 관리자 권한이 있어야 수정할 수 있다.",
  })
  @Auth({ admin: true })
  @Patch(":id")
  @ApiParam({ name: "id", description: "낚시터 ID", type: "string" })
  async updatePlace(
    @Param() { id }: PlaceIdParamDto,
    @Body() { name, description }: UpdatePlaceDto
  ) {
    return this.placeService.updatePlace(id, name, description)
  }

  @ApiOperation({
    summary: "낚시터 매입",
    description: "낚시터를 금액만큼 매입한다.",
  })
  @Post(":id/buy")
  @Auth()
  @ApiParam({ name: "id", description: "낚시터 ID", type: "string" })
  async buyPlace(
    @Request() req: EpRequest,
    @Param() { id }: PlaceIdParamDto,
    @Body() { amount }: BuyPlaceDto
  ) {
    return this.placeService.buy(req.user.id, id, amount)
  }

  @ApiOperation({
    summary: "낚시터 시설 건설",
    description: "해당 ID 종류에 해당하는 시설을 낚시터에 건설한다.",
  })
  @Post(":id/facilities")
  @Auth()
  @ApiParam({ name: "id", description: "낚시터 ID", type: "string" })
  async buildFacility(
    @Param() { id }: PlaceIdParamDto,
    @Body("facility_id") facilityId: string
  ) {
    return this.placeService.build(id, facilityId)
  }

  @ApiOperation({
    summary: "낚시터 시설 조회",
    description: "해당 낚시터에 건설된 시설 목록을 불러온다.",
  })
  @Get(":id/facilities")
  @ApiParam({ name: "id", description: "낚시터 ID", type: "string" })
  @ApiCreatedResponse({ status: 201, type: [FacilitiesDto] })
  async getFacilities(@Param() { id }: PlaceIdParamDto) {
    return this.placeService.getFacilities(id)
  }

  @ApiOperation({
    summary: "낚시터 시설 철거",
    description: "해당 낚시터에 건설된 시설의 ID로 시설을 철거할 수 있다.",
  })
  @Delete(":id/facilities/:facilityId")
  @Auth()
  @ApiParam({ name: "id", description: "낚시터 ID", type: "string" })
  @ApiParam({
    name: "facilityId",
    description: "건설된 시설 ID",
    type: "string",
  })
  @ApiCreatedResponse({ status: 201, type: FacilitiesDto })
  async destroyFacility(@Param() { id, facilityId }: DestroyFacilityParamDto) {
    return this.placeService.destroyFacility(id, facilityId)
  }
}
