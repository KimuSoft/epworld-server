import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OAuthClient } from "./oauthClient.entity";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class OAuthService {
  constructor(
    @InjectRepository(OAuthClient)
    private itemRepository: Repository<OAuthClient>,
    private authService: AuthService
  ) {}

  async createClient(
    name: string,
    description?: string,
    redirectUris?: string[]
  ) {
    const client = new OAuthClient();
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

  async getToken(oauthClient: OAuthClient) {
    await this.authService.sign({ id: oauthClient.id, isOAuth: true });
  }
}
