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
} from "@nestjs/common";
import { PlacesService } from "./places.service";

@Controller("api/places")
export class PlacesController {
  constructor(private readonly placeService: PlacesService) {}

  // 낚시터 생성
  @Post()
  async createPlace(
    @Request() req,
    @Body("name") name: string,
    @Body("owner") ownerId: string,
    @Body("description") description?: string,
    @Body("id") id?: string
  ) {
    const place = await this.placeService.create(
      name,
      ownerId,
      description,
      id
    );
    if (!place) throw new NotFoundException("Place not found");

    return place;
  }

  // 낚시터 정보 불러오기
  @Get(":id")
  async getPlace(@Request() req, @Param("id") id: string) {
    const place = await this.placeService.findById(id);
    if (!place) throw new NotFoundException("Place not found");

    return this.placeService.getPlaceJSON(place);
  }

  @Patch(":id")
  async updatePlace(
    @Request() req,
    @Param("id") id: string,
    @Body("name") name: string,
    @Body("description") description: string
  ) {
    return this.placeService.update(id, name, description);
  }

  // 낚시터 매입
  @Post(":id/buy")
  async buyPlace(
    @Request() req,
    @Param("id") id: string,
    @Query("amount") amount: number
  ) {
    return this.placeService.buy(req.user.id, id, amount);
  }

  @Post(":id/facilities")
  async buildFacility(
    @Request() req,
    @Param("id") id: string,
    @Body("facility_id") facilityId: string
  ) {
    return this.placeService.build(id, facilityId);
  }

  @Get(":id/facilities")
  async getFacilities(@Request() req, @Param("id") id: string) {
    return this.placeService.getFacilities(id);
  }

  @Delete(":id/facilities/:facility_id")
  async destroyFacility(
    @Request() req,
    @Param("id") id: string,
    @Param("facility_id") facilityId: string
  ) {
    return this.placeService.destroyFacility(id, facilityId);
  }
}
