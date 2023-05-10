import { Module } from "@nestjs/common";
import { ItemsService } from "./items.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ItemEntity } from "./item.entity";
import { ItemsController } from "./items.controller";

@Module({
  imports: [TypeOrmModule.forFeature([ItemEntity])],
  providers: [ItemsService],
  controllers: [ItemsController],
})
export class ItemsModule {}
