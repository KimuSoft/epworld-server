import { Injectable } from "@nestjs/common"
import { GameEntity } from "./game.entity"

const games = new Map<string, GameEntity>()

@Injectable()
export class GameRepository {
  async save(game: GameEntity): Promise<GameEntity> {
    console.info(`Game ${game.id} saved`)
    games.set(game.id, game)
    return game
  }

  async get(gameId: string): Promise<GameEntity> {
    return games.get(gameId)
  }

  async findByUserId(userId: string): Promise<GameEntity> {
    return Array.from(games.values()).find((game) => game.userId === userId)
  }

  async remove(gameId: string): Promise<void> {
    games.delete(gameId)
    console.info(`Game ${gameId} removed`)
  }
}
