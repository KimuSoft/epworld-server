import { Module } from "@nestjs/common";
import { PlacesService } from "./places.service";
import { PlacesController } from "./places.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Place } from "./place.entity";
import { UsersService } from "../users/users.service";
import { Facility } from "../facilities/facility.entity";
import { User } from "../users/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Place, Facility, User])],
  providers: [PlacesService],
  controllers: [PlacesController],
})
export class PlacesModule {}
