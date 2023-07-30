import {
  Controller,
  Get,
  NotFoundException,
  NotImplementedException,
  Param,
  Query,
  Request,
} from "@nestjs/common"
import { UsersService } from "./users.service"
import { ApiOperation, ApiTags } from "@nestjs/swagger"
import { Auth } from "../auth/auth.decorator"
import { UserIdParamDto } from "./dto/user-id-param.dto"
import { EpRequest } from "../types"

@ApiTags("Users")
@Controller("api/users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 토큰으로 세션 정보 얻기
  @ApiOperation({
    summary: "본인 정보 조회",
    description: "인증된 본인의 유저 정보를 불러온다.",
  })
  @Auth()
  @Get("me")
  getMe(@Request() req: EpRequest) {
    return req.user
  }

  @ApiOperation({
    summary: "유저 정보 조회",
    description: "해당 ID의 유저 정보를 불러온다.",
  })
  @Get(":id")
  async getUser(@Param() { id }: UserIdParamDto) {
    const user = await this.usersService.findById(id)
    if (!user) throw new NotFoundException()

    return user
  }

  @Get(":id/dex")
  async getUserDex(@Param() { id }: UserIdParamDto) {
    throw new NotImplementedException()
  }

  @ApiOperation({
    summary: "유저가 낚았던 물고기 조회",
    description: "유저가 지금까지 낚았던 물고기 정보를 불러온다.",
  })
  @Get(":id/fish")
  async getUserFish(
    @Param() { id }: UserIdParamDto,
    @Query("get_deleted") getDeleted = false
  ) {
    return this.usersService.getUserItems(id, getDeleted)
  }

  @ApiOperation({
    summary: "유저가 보유한 낚시터 조회",
    description: "유저가 보유한 낚시터들의 정보를 불러온다.",
  })
  @Get(":id/places")
  async getUserPlaces(@Param() { id }: UserIdParamDto) {
    return this.usersService.getUserPlaces(id)
  }
}
