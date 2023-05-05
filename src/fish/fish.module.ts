import { Module } from "@nestjs/common";
import { FishService } from "./fish.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Fish } from "./fish.entity";
import { FishController } from "./fish.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Fish])],
  providers: [FishService],
  controllers: [FishController],
})
export class FishModule {}
