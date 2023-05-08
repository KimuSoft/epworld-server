import { Module } from "@nestjs/common";
import { OAuthService } from "./oauth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OAuthClient } from "./oauthClient.entity";
import { AuthModule } from "../auth/auth.module";
import { OauthController } from './oauth.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OAuthClient]), AuthModule],
  providers: [OAuthService],
  controllers: [OauthController],
})
export class OAuthModule {}
