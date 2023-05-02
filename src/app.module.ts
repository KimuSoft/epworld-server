import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import * as process from "process";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { FishController } from "./fish/fish.controller";
import { FacilitiesModule } from "./facilities/facilities.module";
import { FishModule } from "./fish/fish.module";
import { PlacesModule } from "./places/places.module";
import { PlacesController } from "./places/places.controller";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      url: process.env.DB_URL,
      autoLoadEntities: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "..", "client", "dist"),
    }),
    AuthModule,
    UsersModule,
    PlacesModule,
    FacilitiesModule,
    FishModule,
  ],
  controllers: [AppController, PlacesController, FishController],
  providers: [AppService],
})
export class AppModule {}
