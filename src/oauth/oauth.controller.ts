import {
  Body,
  Controller,
  ForbiddenException,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { OAuthService } from "./oauth.service";
import { ApiOperation } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";

@Controller("oauth")
export class OauthController {
  constructor(private readonly oauthService: OAuthService) {}

  @ApiOperation({
    summary: "OAuth 클라이언트 계정 생성",
    description: "(관리자) 새로운 서드파티를 등록한다.",
  })
  @UseGuards(AuthGuard("jwt"))
  @Post()
  async createOAuthClient(
    @Request() req,
    @Body()
    {
      name,
      description,
      redirect_uris,
    }: { name: string; description: string; redirect_uris: string[] }
  ) {
    if (!req.user.admin) throw new ForbiddenException("You are not admin");
    return this.oauthService.createClient(name, description, redirect_uris);
  }

  @ApiOperation({
    summary: "OAuth 클라이언트 계정 수정",
    description: "(관리자) 서드파티 계정 정보를 수정한다.",
  })
  @UseGuards(AuthGuard("jwt"))
  @Patch(":id")
  async updateOAuthClient(
    @Param("id") id: string,
    @Request() req,
    @Body()
    {
      name,
      description,
      redirect_uris,
    }: { name?: string; description?: string; redirect_uris?: string[] }
  ) {
    if (!req.user.admin) throw new ForbiddenException("You are not admin");
    return this.oauthService.updateClient(id, name, description, redirect_uris);
  }
}
