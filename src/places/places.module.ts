import { Module } from "@nestjs/common";
import { PlacesService } from "./places.service";
import { PlacesController } from "./places.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Place } from "./place.entity";
import { UsersService } from "../users/users.service";

@Module({
  imports: [TypeOrmModule.forFeature([Place]), UsersService],
  providers: [PlacesService],
  controllers: [PlacesController],
})
export class PlacesModule {}
