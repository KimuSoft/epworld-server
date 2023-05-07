import {
  Controller,
  Get,
  UseGuards,
  Request,
  Res,
  Redirect,
  Post,
  Body,
  ForbiddenException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { Response } from "express";
import { LoginDiscordBotDto } from "./auth.dto";

@Controller("api/auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard("discord"))
  @Get("login/discord")
  @Redirect()
  async loginDiscord(@Request() req, @Res() res: Response) {
    const loginResult = await this.authService.login(req.user);
    return { url: "/auth/callback?token=" + loginResult.accessToken };
  }

  // 공식 디스코드 봇만 사용 가능: 봇에서 넘겨준 디스코드 계정 정보를 신뢰하여 디스코드 액세스 토큰 검증 없이 계정을 생성하고 토큰을 발급해 줌.
  @UseGuards(AuthGuard("jwt"))
  @Post("login/discord/bot")
  async loginDiscordBot(
    @Request() req,
    @Body() { id, username, avatar }: LoginDiscordBotDto
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
}
