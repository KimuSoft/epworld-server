import { Module } from "@nestjs/common";
import { FacilitiesController } from "./facilities.controller";
import { FacilitiesService } from "./facilities.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Facility } from "./facility.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Facility])],
  controllers: [FacilitiesController],
  providers: [FacilitiesService],
})
export class FacilitiesModule {}
