import { Module } from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UsersModule } from "./users/users.module"
import { NovelsModule } from "./novels/novels.module"
import { BlocksModule } from "./blocks/blocks.module"
import { EpisodesModule } from "./episodes/episodes.module"
import { AuthModule } from "./auth/auth.module"
import * as process from "process"
import { ServeStaticModule } from "@nestjs/serve-static"
import { join } from "path"
import { PlaceController } from './place/place.controller';
import { PlaceModule } from './place/place.module';
import { FishController } from './fish/fish.controller';
import { FacilitiesModule } from './facilities/facilities.module';
import { FishModule } from './fish/fish.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      url: process.env.DB_URL,
      autoLoadEntities: true,
    }),
    UsersModule,
    NovelsModule,
    BlocksModule,
    EpisodesModule,
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "..", "client", "dist"),
    }),
    PlaceModule,
    FacilitiesModule,
    FishModule,
  ],
  controllers: [AppController, PlaceController, FishController],
  providers: [AppService],
})
export class AppModule {}
