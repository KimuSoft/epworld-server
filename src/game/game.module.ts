import { Module } from "@nestjs/common"
import { GameGateway } from "./game.gateway"
import { GameService } from "./game.service"
import { AuthModule } from "../auth/auth.module"
import { UsersModule } from "../users/users.module"
import { PlacesModule } from "../places/places.module"

@Module({
  imports: [AuthModule, UsersModule, PlacesModule],
  providers: [GameGateway, GameService],
})
export class GameModule {}
