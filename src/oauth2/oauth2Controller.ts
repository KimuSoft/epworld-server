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
import { OAuth2Service } from "./oauth2.service";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { OAuth2LoginDto } from "./oauth2.dto";

@ApiTags("OAuth2")
@Controller("api/oauth2")
export class OAuth2Controller {
  constructor(private readonly oauthService: OAuth2Service) {}

  @ApiOperation({
    summary: "OAuth2 클라이언트 계정 생성",
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
    summary: "OAuth2 클라이언트 계정 수정",
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
    summary: "OAuth2 로그인 페이지",
    description: "서드파티에서 로그인 요청을 할 수 있습니다.",
  })
  @UseGuards(AuthGuard("jwt"))
  @Get("login")
  @ApiQuery({
    name: "client_id",
    description: "서드파티 클라이언트 ID",
    type: "string",
  })
  @ApiQuery({
    name: "redirect_uri",
    description: "확인 후 토큰과 함께 리다이렉트 될 URL",
    type: "string",
  })
  async OAuth2LoginPage(
    @Request() req,
    @Query()
    { client_id, redirect_uri }: OAuth2LoginDto
  ) {
    const oauthClient = await this.oauthService.findClientById(client_id);

    if (!oauthClient) throw new ForbiddenException("Invalid client id");

    if (!oauthClient.redirectUris.includes(redirect_uri))
      throw new ForbiddenException("Invalid redirect uri");

    const oauthToken = await this.oauthService.getToken(oauthClient);

    return `<h1>${req.user.username}님! ${oauthClient.name} 서드파티를 신용하신다면 아래 버튼을 눌러 주세요!<h1><a href="${redirect_uri}?token=${oauthToken}">호애앵 믿어요!!!</a>`;
  }
}
