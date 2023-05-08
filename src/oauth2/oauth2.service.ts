import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OAuth2Client } from "./oauth2Client.entity";
import { AuthService } from "../auth/auth.service";
import crypto from "crypto";

@Injectable()
export class OAuth2Service {
  constructor(
    @InjectRepository(OAuth2Client)
    private itemRepository: Repository<OAuth2Client>,
    private authService: AuthService
  ) {}

  async createClient(
    name: string,
    description?: string,
    redirectUris?: string[]
  ) {
    const client = new OAuth2Client();
    client.name = name;
    client.description = description;
    client.redirectUris = redirectUris;
    client.secret = crypto.randomBytes(16).toString("hex");

    return this.itemRepository.save(client);
  }

  async updateClient(
    id: string,
    name?: string,
    description?: string,
    redirectUris?: string[]
  ) {
    const client = await this.findClientById(id);
    if (name) client.name = name;
    if (description) client.description = description;
    if (redirectUris) client.redirectUris = redirectUris;

    return this.itemRepository.save(client);
  }
  async findClientById(id: string) {
    return this.itemRepository.findOneBy({ id });
  }

  async createToken(userId: string, oauthClientId: string) {
    return this.authService.sign({
      id: userId,
      clientId: oauthClientId,
    });
  }

  async createCode(oauthClient: OAuth2Client, userId: string) {
    return this.authService.sign({
      code: true,
      clientId: oauthClient.id,
      userId,
    });
  }

  async findClientBySecret(secret: string) {
    return this.itemRepository.findOneBy({ secret });
  }

  async verifyCode(code: string) {
    const payload: { code: boolean; clientId: string; userId: string } =
      await this.authService.verify(code);
    if (!payload.code) throw new NotFoundException("Invalid code");
    return payload;
  }
}
