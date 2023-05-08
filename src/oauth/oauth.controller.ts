import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import { OAuthService } from "./oauth.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { OAuthLoginDto } from "./oauth.dto";

@ApiTags("OAuth")
@Controller("api/oauth")
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

  @ApiOperation({
    summary: "OAuth 로그인 페이지",
    description: "서드파티에서 로그인 요청을 할 수 있습니다.",
  })
  @UseGuards(AuthGuard("jwt"))
  @Get("login")
  async OAuthLoginPage(
    @Request() req,
    @Query()
    { client_id, redirect_uri }: OAuthLoginDto
  ) {
    const oauthClient = await this.oauthService.findClientById(client_id);

    if (!oauthClient) throw new ForbiddenException("Invalid client id");

    if (!oauthClient.redirectUris.includes(redirect_uri))
      throw new ForbiddenException("Invalid redirect uri");

    const oauthToken = await this.oauthService.getToken(oauthClient);

    return `<h1>${req.user.username}님! ${oauthClient.name} 서드파티를 신용하신다면 아래 버튼을 눌러 주세요!<h1><a href="${redirect_uri}?token=${oauthToken}">호애앵 믿어요!!!</a>`;
  }
}
