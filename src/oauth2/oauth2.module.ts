import { Module } from "@nestjs/common";
import { OAuth2Service } from "./oauth2.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OAuth2ClientEntity } from "./oauth2Client.entity";
import { AuthModule } from "../auth/auth.module";
import { OAuth2Controller } from "./oauth2.controller";

@Module({
  imports: [TypeOrmModule.forFeature([OAuth2ClientEntity]), AuthModule],
  providers: [OAuth2Service],
  controllers: [OAuth2Controller],
})
export class Oauth2Module {}
