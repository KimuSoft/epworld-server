import { Module } from "@nestjs/common";
import { FishService } from "./fish.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Fish } from "./fish.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Fish])],
  providers: [FishService],
})
export class FishModule {}
