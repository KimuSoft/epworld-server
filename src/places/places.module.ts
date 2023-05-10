import { Module } from "@nestjs/common";
import { PlacesService } from "./places.service";
import { PlacesController } from "./places.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PlaceEntity } from "./place.entity";
import { Facility } from "../facilities/facility.entity";
import { UserEntity } from "../users/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([PlaceEntity, Facility, UserEntity])],
  exports: [PlacesService],
  providers: [PlacesService],
  controllers: [PlacesController],
})
export class PlacesModule {}
