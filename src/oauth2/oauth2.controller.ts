import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Redirect,
  Request,
} from "@nestjs/common";
import { OAuth2Service } from "./oauth2.service";
import {
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import {
  OAuth2AccessTokenDto,
  OAuth2ClientCreateDto,
  OAuth2ClientIdParamDto,
  OAuth2LoginDto,
} from "./oauth2.dto";
import { Auth } from "../auth/auth.decorator";

@ApiTags("OAuth2")
@Controller("api/oauth2")
export class OAuth2Controller {
  constructor(private readonly oauthService: OAuth2Service) {}

  @ApiOperation({
    summary: "Create OAuth2 Client Account",
    description: "(관리자) 새로운 서드파티를 등록한다.",
  })
  @Auth({ admin: true })
  @Post()
  async createOAuthClient(
    @Request() req,
    @Body()
    { name, description, redirect_uris }: OAuth2ClientCreateDto
  ) {
    if (!req.user.admin) throw new ForbiddenException("You are not admin");
    return this.oauthService.createClient(name, description, redirect_uris);
  }

  @ApiOperation({
    summary: "Edit OAuth2 Client Account",
    description: "(관리자) 서드파티 계정 정보를 수정한다.",
  })
  @Auth({ admin: true })
  @Patch(":id")
  @ApiParam({ name: "id", description: "Client ID", type: "string" })
  async updateOAuthClient(
    @Param() { id }: OAuth2ClientIdParamDto,
    @Request() req,
    @Body()
    {
      name,
      description,
      redirect_uris,
    }: { name?: string; description?: string; redirect_uris?: string[] }
  ) {
    console.log("ID조회");
    return this.oauthService.updateClient(id, name, description, redirect_uris);
  }

  @ApiOperation({
    summary: "Search OAuth2 Client Account",
    description: "(관리자) 서드파티 계정 정보를 검색한다.",
  })
  @Get("search")
  @Auth({ admin: true })
  async searchOAuthClient() {
    console.log("검색하장");
    const results = await this.oauthService.find();
    console.log(results);
    return results;
  }

  @ApiOperation({
    summary: "Get OAuth2 Client Account",
    description: "(관리자) 서드파티 계정 정보를 조회한다.",
  })
  @Get(":id")
  @ApiParam({ name: "id", description: "Client ID", type: "string" })
  @Auth({ admin: true })
  @ApiNotFoundResponse({ description: "Client not found" })
  async getOAuthClient(@Param() { id }: OAuth2ClientIdParamDto) {
    const oauthClient = await this.oauthService.findClientById(id);
    if (!oauthClient) throw new ForbiddenException("Client not found");
    return oauthClient;
  }

  @ApiOperation({
    summary: "Get OAuth2 Access Token",
    description: "클라이언트 시크릿과 코드를 주면 액세스 토큰을 드립니다.",
  })
  @Post("token")
  async OAuth2AccessToken(
    @Body()
    { code, client_secret }: OAuth2AccessTokenDto
  ) {
    const oauthClient = await this.oauthService.findClientBySecret(
      client_secret
    );
    if (!oauthClient) throw new ForbiddenException("Invalid client secret");

    const oauthCode = await this.oauthService.verifyCode(code);

    if (!oauthCode) throw new ForbiddenException("Invalid code");

    if (oauthCode.clientId !== oauthClient.id)
      throw new ForbiddenException("Invalid code");

    const oauthToken = await this.oauthService.createToken(
      oauthCode.userId,
      oauthClient.id
    );

    return {
      access_token: oauthToken,
      token_type: "Bearer",
      expires_in: "몰라",
      refresh_token: "몰라",
    };
  }

  @ApiOperation({
    summary: "Get OAuth2 Code",
    description: "코드를 주고 리다이렉트시켜버려요",
  })
  @Get("code")
  @Auth()
  @Redirect()
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
  async OAuth2Code(
    @Request() req,
    @Query() { client_id, redirect_uri }: OAuth2LoginDto
  ) {
    const oauthClient = await this.oauthService.findClientById(client_id);

    if (!oauthClient) throw new ForbiddenException("Invalid client id");

    if (!oauthClient.redirectUris.includes(redirect_uri))
      throw new ForbiddenException("Invalid redirect uri");

    const oauthCode = await this.oauthService.createCode(
      oauthClient,
      req.user.id
    );

    return { url: redirect_uri + "?code=" + oauthCode };
  }

  @ApiOperation({
    summary: "(Temporary) OAuth2 Authorization Page",
    description: "서드파티에서 인증 요청을 할 수 있습니다.",
  })
  @Get("authorize")
  @Auth()
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

    return `<h1>${req.user.username}님! ${oauthClient.name} 서드파티를 신용하신다면 아래 버튼을 눌러 주세요!<h1><a href=api/oauth/code">호애앵 믿어요!!!</a>`;
  }
}
