import {
  Controller,
  Get,
  UseGuards,
  Request,
  Redirect,
  Post,
  Body,
  ForbiddenException,
  Query,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { LoginDiscordBotDto } from "./auth.dto";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Auth } from "./auth.decorator";

@ApiTags("Auth")
@Controller("api/auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: "디스코드로 로그인",
    description: "디스코드 계정으로 이프에 로그인할 수 있다.",
  })
  @UseGuards(AuthGuard("discord"))
  @Get("login/discord")
  @Redirect()
  async loginDiscord(@Request() req) {
    const loginResult = await this.authService.login(req.user);
    return {
      url:
        "https://test.kimusoft.dev/auth/callback" +
        "?token=" +
        loginResult.accessToken,
    };
  }

  @ApiOperation({
    summary: "키뮤스토리 계정으로 로그인",
    description: "키뮤스토리 계정으로 이프에 로그인할 수 있다.",
  })
  @UseGuards(AuthGuard("kimustory"))
  @Get("login/kimustory")
  @Redirect()
  async loginKimustory(@Request() req) {
    const loginResult = await this.authService.login(req.user);
    return { url: "/login?token=" + loginResult.accessToken };
  }

  @ApiOperation({
    summary: "(관리자) 무검증 디스코드 계정 로그인",
    description:
      "공식 디스코드 봇 전용 API로, 봇에서 넘겨준 디스코드 계정 정보를 신뢰하여 디스코드 액세스 토큰 검증 없이 계정을 생성하고 액세스 토큰을 발급해 줍니다.",
  })
  @Auth({ admin: true })
  @Post("login/discord/bot")
  async loginDiscordBot(
    @Request() req,
    @Body()
    { id, username, avatar }: LoginDiscordBotDto
  ) {
    if (!req.user.admin)
      throw new ForbiddenException(
        "Only administrators can create accounts without validation."
      );

    const user = await this.authService.validateUser(
      "discord",
      id,
      username,
      avatar
    );

    return {
      user,
      ...(await this.authService.login(user, true)),
    };
  }

  @ApiOperation({
    summary: "(관리자) 무검증 마인크래프트 계정 로그인",
    description:
      "공식 마인크래프트 서버 전용 API로, 봇에서 넘겨준 마인크래프트 플레이어 ID 정보를 신뢰하여 디스코드 액세스 토큰 검증 없이 계정을 생성하고 액세스 토큰을 발급해 줍니다.",
  })
  @UseGuards(AuthGuard("jwt"))
  @Post("login/minecraft/bot")
  async loginMinecraft(
    @Request() req,
    @Body() { id, username, avatar }: LoginDiscordBotDto
  ) {
    if (!req.user.admin)
      throw new ForbiddenException(
        "Only administrators can create accounts without validation."
      );

    const user = await this.authService.validateUser(
      "minecraft",
      id,
      username,
      avatar
    );

    return {
      user,
      ...(await this.authService.login(user, true)),
    };
  }
}
