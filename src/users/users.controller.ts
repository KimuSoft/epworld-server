import {
  Body,
  Controller,
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
import { AuthGuard } from "@nestjs/passport";
import { UsersService } from "./users.service";
import { CreateUserDto, UpdateUserDto, UsersParamDto } from "./users.dto";

@Controller("api/users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 관리자가 직접 계정을 생성하는 경우에만 사용함. (일반적으로는 login을 통해 계정 생성)
  @UseGuards(AuthGuard("jwt"))
  @Post(":id")
  async createUser(
    @Request() req,
    @Param() { id }: UsersParamDto,
    @Body() { username, avatar }: CreateUserDto
  ) {
    if (!req.user.admin) throw new ForbiddenException("You are not admin");
    return this.usersService.create(id, username, avatar);
  }

  // 토큰으로 세션 정보 얻기
  @UseGuards(AuthGuard("jwt"))
  @Get("me")
  getMe(@Request() req) {
    return req.user;
  }

  // 유저 정보 조회
  @Get(":id")
  async getUser(@Param() { id }: UsersParamDto) {
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException("User not found");

    return user;
  }

  // 유저 정보 업데이트
  @Patch(":id")
  async updateUser(
    @Param() { id }: UsersParamDto,
    @Body() { username, avatar }: UpdateUserDto
  ) {
    return this.usersService.update(id, username, avatar);
  }

  // @Get(":id/dex")
  // async getUserDex(@Param("id") id: string) {}

  @Get(":id/fish")
  async getUserFish(
    @Param() { id }: UsersParamDto,
    @Query("get_deleted") getDeleted = false
  ) {
    return this.usersService.getUserItems(id, getDeleted);
  }

  @Get(":id/places")
  async getUserPlaces(@Param() { id }: UsersParamDto) {
    return this.usersService.getUserPlaces(id);
  }
}
