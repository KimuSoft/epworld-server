import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import * as process from "process";
import { FacilitiesModule } from "./facilities/facilities.module";
import { PlacesModule } from "./places/places.module";
import { GameModule } from "./game/game.module";
import { ItemsModule } from "./item/items.module";
import { APP_PIPE } from "@nestjs/core";
import { ZodValidationPipe } from "nestjs-zod";
import { OAuthModule } from "./oauth/oauth.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      url: process.env.DB_URL,
      autoLoadEntities: true,
    }),
    AuthModule,
    UsersModule,
    PlacesModule,
    FacilitiesModule,
    ItemsModule,
    GameModule,
    OAuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
