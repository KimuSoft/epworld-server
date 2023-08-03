import { Module } from "@nestjs/common"
import { GameGateway } from "./game.gateway"
import { GameService } from "./game.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { PlaceEntity } from "../places/place.entity"
import { UserEntity } from "../users/user.entity"
import { GameRepository } from "./game.repository"
import { AuthModule } from "../auth/auth.module"
import { IGameGateway } from "./igame.gateway"

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, PlaceEntity]), AuthModule],
  providers: [GameGateway, GameService, GameRepository],
  controllers: [IGameGateway],
})
export class GameModule {}
