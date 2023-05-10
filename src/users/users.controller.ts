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
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto, UpdateUserDto, UsersParamDto } from "./users.dto";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { Auth, User } from "../auth/auth.decorator";
import { UserEntity } from "./user.entity";

@ApiTags("Users")
@Controller("api/users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: "유저 계정 생성",
    description:
      "관리자가 직접 계정을 생성하는 경우에만 사용한다. 일반적으로는 login을 통해 계정을 생성하며, 이 방식으로는 액세스 토큰을 얻을 수 없다.",
  })
  @Auth()
  @Post(":id")
  @ApiParam({ name: "id", description: "User ID", type: "string" })
  async createUser(
    @User() user: UserEntity,
    @Param() { id }: UsersParamDto,
    @Body() { username, avatar }: CreateUserDto
  ) {
    if (!user.admin) throw new ForbiddenException("You are not admin");
    return this.usersService.create(id, username, avatar);
  }

  // 토큰으로 세션 정보 얻기
  @ApiOperation({
    summary: "본인 정보 조회",
    description: "인증된 본인의 유저 정보를 불러온다.",
  })
  @Auth()
  @Get("me")
  getMe(@Request() req) {
    return req.user;
  }

  @ApiOperation({
    summary: "유저 정보 조회",
    description: "해당 ID의 유저 정보를 불러온다.",
  })
  @Get(":id")
  @ApiParam({ name: "id", description: "User ID", type: "string" })
  async getUser(@Param() { id }: UsersParamDto) {
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException("User not found");

    return user;
  }

  @ApiOperation({
    summary: "유저 정보 수정",
    description: "해당 ID의 유저 정보를 수정한다. 본인 또는 관리자만 가능하다.",
  })
  @Patch(":id")
  @Auth({ admin: true })
  @ApiParam({ name: "id", description: "User ID", type: "string" })
  async updateUser(
    @Param() { id }: UsersParamDto,
    @Body() { username, avatar }: UpdateUserDto
  ) {
    return this.usersService.update(id, username, avatar);
  }

  // @Get(":id/dex")
  // async getUserDex(@Param("id") id: string) {}

  @ApiOperation({
    summary: "유저가 낚았던 물고기 조회",
    description: "유저가 지금까지 낚았던 물고기 정보를 불러온다.",
  })
  @Get(":id/fish")
  @ApiParam({ name: "id", description: "User ID", type: "string" })
  async getUserFish(
    @Param() { id }: UsersParamDto,
    @Query("get_deleted") getDeleted = false
  ) {
    return this.usersService.getUserItems(id, getDeleted);
  }

  @ApiOperation({
    summary: "유저가 보유한 낚시터 조회",
    description: "유저가 보유한 낚시터들의 정보를 불러온다.",
  })
  @Get(":id/places")
  @ApiParam({ name: "id", description: "User ID", type: "string" })
  async getUserPlaces(@Param() { id }: UsersParamDto) {
    return this.usersService.getUserPlaces(id);
  }
}
