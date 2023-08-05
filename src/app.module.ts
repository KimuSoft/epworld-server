import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UsersModule } from "./users/users.module"
import { AuthModule } from "./auth/auth.module"
import * as process from "process"
import { FacilitiesModule } from "./facilities/facilities.module"
import { PlacesModule } from "./places/places.module"
import { GameModule } from "./game/game.module"
import { ItemsModule } from "./items/items.module"
import { APP_PIPE } from "@nestjs/core"
import { ZodValidationPipe } from "nestjs-zod"
import { Oauth2Module } from "./oauth2/oauth2.module"
import { EventEmitterModule } from "@nestjs/event-emitter"

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      url: process.env.DB_URL,
      autoLoadEntities: true,
      logging: true,
    }),
    EventEmitterModule.forRoot(),
    AuthModule,
    UsersModule,
    PlacesModule,
    FacilitiesModule,
    ItemsModule,
    GameModule,
    Oauth2Module,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
