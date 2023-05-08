import { Module } from "@nestjs/common";
import { OAuth2Service } from "./oauth2.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OAuth2Client } from "./oauth2Client.entity";
import { AuthModule } from "../auth/auth.module";
import { OAuth2Controller } from "./oauth2Controller";

@Module({
  imports: [TypeOrmModule.forFeature([OAuth2Client]), AuthModule],
  providers: [OAuth2Service],
  controllers: [OAuth2Controller],
})
export class Oauth2Module {}
