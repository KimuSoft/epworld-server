import { Injectable } from "@nestjs/common"
import { GameEntity } from "./game.entity"

const games = new Map<string, GameEntity>()

@Injectable()
export class GameRepository {
  async save(game: GameEntity): Promise<GameEntity> {
    games.set(game.id, game)
    return game
  }

  async get(gameId: string): Promise<GameEntity> {
    return games.get(gameId)
  }

  async remove(gameId: string): Promise<void> {
    games.delete(gameId)
  }
}
