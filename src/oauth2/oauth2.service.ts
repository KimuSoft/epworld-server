import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { FindManyOptions, Repository } from "typeorm"
import { OAuth2ClientEntity } from "./oauth2Client.entity"
import { AuthService } from "../auth/auth.service"
import * as crypto from "crypto"

@Injectable()
export class OAuth2Service {
  constructor(
    @InjectRepository(OAuth2ClientEntity)
    private oAuth2ClientRepository: Repository<OAuth2ClientEntity>,
    private authService: AuthService
  ) {}

  async createClient(
    name: string,
    description?: string,
    redirectUris?: string[]
  ) {
    const client = new OAuth2ClientEntity()
    client.name = name
    client.description = description
    client.redirectUris = redirectUris
    client.secret = crypto.randomBytes(16).toString("hex")

    return this.oAuth2ClientRepository.save(client)
  }

  async updateClient(
    id: string,
    name?: string,
    description?: string,
    redirectUris?: string[]
  ) {
    const client = await this.findClientById(id)
    if (name) client.name = name
    if (description) client.description = description
    if (redirectUris) client.redirectUris = redirectUris

    return this.oAuth2ClientRepository.save(client)
  }

  async find(options: FindManyOptions<OAuth2ClientEntity> = {}) {
    return this.oAuth2ClientRepository.find()
  }
  async findClientById(id: string) {
    console.log(id)
    return this.oAuth2ClientRepository.findOneBy({ id })
  }

  async createToken(userId: string, oauthClientId: string) {
    return this.authService.sign({
      id: userId,
      clientId: oauthClientId,
    })
  }

  async createCode(oauthClient: OAuth2ClientEntity, userId: string) {
    return this.authService.sign({
      code: true,
      clientId: oauthClient.id,
      userId,
    })
  }

  async findClientBySecret(secret: string) {
    return this.oAuth2ClientRepository.findOneBy({ secret })
  }

  async verifyCode(code: string) {
    const payload: { code: boolean; clientId: string; userId: string } =
      await this.authService.verify(code)
    if (!payload.code) throw new NotFoundException("Invalid code")
    return payload
  }
}
