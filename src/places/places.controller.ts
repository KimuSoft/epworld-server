import {
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Request,
} from "@nestjs/common";
import { PlacesService } from "./places.service";
import { UsersService } from "../users/users.service";

@Controller("places")
export class PlacesController {
  constructor(
    private readonly placeService: PlacesService,
    private readonly usersService: UsersService
  ) {}

  // 낚시터 정보 불러오기
  @Get(":id")
  async getPlace(@Request() req, @Param("id") id: string) {
    const place = await this.placeService.findOne(id);
    if (!place) throw new NotFoundException("Place not found");

    return this.placeService.getPlaceJSON(place);
  }

  // 낚시터 생성
  @Post("create")
  async createPlace(
    @Request() req,
    @Query("name") name: string,
    @Query("owner") ownerId: string,
    @Query("description") description?: string,
    @Query("id") id?: string
  ) {
    const owner = await this.usersService.findOne(ownerId);
    if (!owner) throw new NotFoundException("Owner not found");

    const place = await this.placeService.create(name, owner, description, id);
    if (!place) throw new NotFoundException("Place not found");

    return this.placeService.getPlaceJSON(place);
  }

  // 낚시터 매입
  @Post(":id/buy")
  async buyPlace(
    @Request() req,
    @Param("id") id: string,
    @Query("amount") amount: number
  ) {
    const place = await this.placeService.findOne(id);
    if (!place) throw new NotFoundException("Place not found");

    const newOwner = await this.usersService.findOne(req.user.id);
    if (!newOwner) throw new NotFoundException("User not found");

    if (amount <= 0) throw new ForbiddenException({ error: "InvalidAmount" });

    if (newOwner.money < amount)
      throw new ForbiddenException({ error: "NotEnoughMoney" });

    const oldOwner = place.owner;
    if (oldOwner.id === newOwner.id) {
      newOwner.money -= amount;
      place.price += amount;

      await this.usersService.save(newOwner);
      await this.placeService.save(place);
    } else {
      oldOwner.money += place.price;
      newOwner.money -= amount;
      place.owner = newOwner;
      place.price = amount;

      await this.usersService.save(oldOwner);
      await this.usersService.save(newOwner);
      await this.placeService.save(place);
    }
  }
}
