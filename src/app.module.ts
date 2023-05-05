import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import * as process from "process";
import { FacilitiesModule } from "./facilities/facilities.module";
import { FishModule } from "./fish/fish.module";
import { PlacesModule } from "./places/places.module";

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
    FishModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
