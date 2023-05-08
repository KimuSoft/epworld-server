import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OAuth2Client } from "./oauth2Client.entity";
import { AuthService } from "../auth/auth.service";

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

  async getToken(oauthClient: OAuth2Client) {
    return this.authService.sign({
      id: oauthClient.id,
      clientId: oauthClient.id,
    });
  }
}
