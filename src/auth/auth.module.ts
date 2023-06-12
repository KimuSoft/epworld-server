import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsersModule } from "../users/users.module";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { DiscordStrategy } from "./discord.strategy";
import { JwtStrategy } from "./jwt.strategy";
import { KimustoryStrategy } from "./kimustory.strategy";

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET!,
      signOptions: { expiresIn: "1d" },
    }),
  ],
  exports: [AuthService],
  providers: [AuthService, DiscordStrategy, JwtStrategy, KimustoryStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
