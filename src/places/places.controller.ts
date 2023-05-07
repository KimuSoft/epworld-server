import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import { PlacesService } from "./places.service";
import { AuthGuard } from "@nestjs/passport";
import {
  BuyPlaceDto,
  CreatePlaceDto,
  DestroyFacilityParamDto,
  PlacesParamDto,
  UpdatePlaceDto,
} from "./place.dto";
import { ApiCreatedResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import {
  FacilitiesDto,
  Facility,
  facilitySchema,
} from "../facilities/facility.entity";

@ApiTags("Places")
@Controller("api/places")
export class PlacesController {
  constructor(private readonly placeService: PlacesService) {}

  @ApiOperation({
    summary: "낚시터 생성",
    description: "공식 디스코드 봇 전용. 낚시터를 생성할 수 있다.",
  })
  @UseGuards(AuthGuard("jwt"))
  @Post()
  async createPlace(
    @Request() req,
    @Body() { id, name, ownerId, description }: CreatePlaceDto
  ) {
    if (!req.user.admin) throw new ForbiddenException("You are not admin");
    console.log(req.user);

    return this.placeService.create(name, ownerId, description, id);
  }

  @ApiOperation({
    summary: "낚시터 조회",
    description: "낚시터 ID로 해당 낚시터의 정보를 불러온다.",
  })
  @Get(":id")
  async getPlace(@Request() req, @Param() { id }: PlacesParamDto) {
    const place = await this.placeService.findById(id);
    if (!place) throw new NotFoundException("Place not found");

    return place;
  }

  @ApiOperation({
    summary: "낚시터 수정",
    description:
      "낚시터의 정보를 수정한다. 일부 정보는 관리자 권한이 있어야 수정할 수 있다.",
  })
  @Patch(":id")
  async updatePlace(
    @Request() req,
    @Param() { id }: PlacesParamDto,
    @Body() { name, description }: UpdatePlaceDto
  ) {
    return this.placeService.update(id, name, description);
  }

  @ApiOperation({
    summary: "낚시터 매입",
    description:
      "낚시터를 매입한다. 구매자의 ID를 넣지 않을 경우 본인을 구매자로 자동 설정한다.",
  })
  @Post(":id/buy")
  async buyPlace(
    @Request() req,
    @Param() { id }: PlacesParamDto,
    @Body() { userId, amount }: BuyPlaceDto
  ) {
    let buyerId = req.user.id;

    // 어드민만 구매자의 ID를 직접 설정할 수 있음. (일반 유저는 자신의 ID로만 가능)
    if (userId && req.user.id !== userId) {
      if (!req.user.admin) throw new ForbiddenException("You are not admin");
      buyerId = userId;
    }

    return this.placeService.buy(buyerId, id, amount);
  }

  @ApiOperation({
    summary: "낚시터 시설 건설",
    description: "해당 ID 종류에 해당하는 시설을 낚시터에 건설한다.",
  })
  @Post(":id/facilities")
  async buildFacility(
    @Request() req,
    @Param() { id }: PlacesParamDto,
    @Body("facility_id") facilityId: string
  ) {
    return this.placeService.build(id, facilityId);
  }

  @ApiOperation({
    summary: "낚시터 시설 조회",
    description: "해당 낚시터에 건설된 시설 목록을 불러온다.",
  })
  @ApiCreatedResponse({ status: 201, type: [FacilitiesDto] })
  @Get(":id/facilities")
  async getFacilities(@Request() req, @Param() { id }: PlacesParamDto) {
    return this.placeService.getFacilities(id);
  }

  @ApiOperation({
    summary: "낚시터 시설 철거",
    description: "해당 낚시터에 건설된 시설의 ID로 시설을 철거할 수 있다.",
  })
  @ApiCreatedResponse({ status: 201, type: FacilitiesDto })
  @Delete(":id/facilities/:facilityId")
  async destroyFacility(
    @Request() req,
    @Param() { id, facilityId }: DestroyFacilityParamDto
  ) {
    return this.placeService.destroyFacility(id, facilityId);
  }
}
