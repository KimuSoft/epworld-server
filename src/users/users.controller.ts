import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UsersService } from "./users.service";

@Controller("api/users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 토큰으로 세션 정보 얻기
  @UseGuards(AuthGuard("jwt"))
  @Get("me")
  getMe(@Request() req) {
    return req.user;
  }

  // 유저 정보 조회
  @Get(":id")
  async getUser(@Param("id") id: string) {
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException("User not found");

    return user;
  }

  // 유저 정보 업데이트
  @Patch(":id")
  async updateUser(
    @Param("id") id: string,
    @Body("username") username: string,
    @Body("avatar") avatar: string
  ) {
    return this.usersService.update(id, username, avatar);
  }

  // @Get(":id/dex")
  // async getUserDex(@Param("id") id: string) {}

  @Get(":id/fish")
  async getUserFish(
    @Param("id") id: string,
    @Query("get_deleted") getDeleted = false
  ) {
    return this.usersService.getUserFish(id, getDeleted);
  }

  @Get(":id/places")
  async getUserPlaces(@Param("id") id: string) {
    return this.usersService.getUserPlaces(id);
  }
}
