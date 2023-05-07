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

@Controller("api/places")
export class PlacesController {
  constructor(private readonly placeService: PlacesService) {}

  // 낚시터 생성
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

  // 낚시터 정보 불러오기
  @Get(":id")
  async getPlace(@Request() req, @Param() { id }: PlacesParamDto) {
    const place = await this.placeService.findById(id);
    if (!place) throw new NotFoundException("Place not found");

    return place;
  }

  @Patch(":id")
  async updatePlace(
    @Request() req,
    @Param() { id }: PlacesParamDto,
    @Body() { name, description }: UpdatePlaceDto
  ) {
    return this.placeService.update(id, name, description);
  }

  // 낚시터 매입
  @Post(":id/buy")
  async buyPlace(
    @Request() req,
    @Param() { id }: PlacesParamDto,
    @Query() { userId, amount }: BuyPlaceDto
  ) {
    let buyerId = req.user.id;

    // 어드민만 구매자의 ID를 직접 설정할 수 있음. (일반 유저는 자신의 ID로만 가능)
    if (userId && req.user.id !== userId) {
      if (!req.user.admin) throw new ForbiddenException("You are not admin");
      buyerId = userId;
    }

    return this.placeService.buy(buyerId, id, amount);
  }

  @Post(":id/facilities")
  async buildFacility(
    @Request() req,
    @Param() { id }: PlacesParamDto,
    @Body("facility_id") facilityId: string
  ) {
    return this.placeService.build(id, facilityId);
  }

  @Get(":id/facilities")
  async getFacilities(@Request() req, @Param() { id }: PlacesParamDto) {
    return this.placeService.getFacilities(id);
  }

  @Delete(":id/facilities/:facilityId")
  async destroyFacility(
    @Request() req,
    @Param() { id, facilityId }: DestroyFacilityParamDto
  ) {
    return this.placeService.destroyFacility(id, facilityId);
  }
}
