import { Injectable } from "@nestjs/common"
import { AuthService } from "../auth/auth.service"
import { EpSocket, VerifiedData } from "./game.type"
import { PlaceEntity } from "../places/place.entity"
import { InjectRepository } from "@nestjs/typeorm"
import { UserEntity } from "../users/user.entity"
import { Repository } from "typeorm"
import { GameRepository } from "./game.repository"
import {
  GameEntity,
  GameResult,
  GameState,
  InvalidStateError,
  TurnType,
} from "./game.entity"
import { PlacePublicity } from "../types"
import { GameEventDto, GameEventType } from "./dto/game-event.dto"
import { WsException } from "@nestjs/websockets"

@Injectable()
export class GameService {
  constructor(
    private readonly gameRepository: GameRepository,
    private readonly authService: AuthService,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(PlaceEntity)
    private readonly placeRepository: Repository<PlaceEntity>
  ) {}

  // 유저가 가장 최근에 접속했던 낚시터를 가져옵니다. 없을 경우 유저의 기본 낚시터를 가져옵니다.
  // 기본 낚시터가 없을 경우 자동으로 새로 생성합니다.
  async getRecentPlaceId(userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ["places"],
    })

    if (!user) throw new Error("User not found")
    if (user.recentPlaceId) return user.recentPlaceId
    if (user.places.length) return user.places[0].id

    const newPlace = new PlaceEntity()
    newPlace.name = user.username + "의 낚시터"
    newPlace.owner = user
    await this.placeRepository.save(newPlace)

    return newPlace.id
  }

  async checkPlaceIsJoinable(
    userId: string,
    placeId: string
  ): Promise<boolean> {
    const place = await this.findPlaceById(placeId)
    // 낚시터가 존재하지 않는 경우
    if (!place) return false
    // 낚시터가 비공개가 아닌 경우
    if (place.publicity !== PlacePublicity.Private) return true
    // 낚시터 주인이 본인인 경우
    return place.ownerId === userId
  }

  async changeRecentPlace(userId: string, placeId: string) {
    return this.usersRepository.update(userId, { recentPlaceId: placeId })
  }

  async gameStart(userId: string, placeId: string) {
    if (await this.gameRepository.findByUserId(userId)) return null

    const game = new GameEntity({ userId, placeId })
    await game.start()
    await this.gameRepository.save(game)

    return game
  }

  async cancelGame(userId: string) {
    const game = await this.gameRepository.findByUserId(userId)
    if (!game) throw new WsException("Game not started")

    await this.gameRepository.remove(game.id)
  }

  async continueGame(userId: string) {
    const game = await this.gameRepository.findByUserId(userId)
    if (!game) throw new WsException("Game not started")

    try {
      await game.continue()
    } catch (e) {
      if (e instanceof InvalidStateError) return null
      throw e
    }
    return this.gameRepository.save(game)
  }

  async gameProgress(
    gameId: string
  ): Promise<{ event: GameEventDto; timeout: number }> {
    const game = await this.gameRepository.get(gameId)
    if (!game) return { event: null, timeout: 0 }

    if (game.state === GameState.WaitingForContinue) {
      await this.gameRepository.remove(game.id)
      return {
        event: {
          turn: 0,
          text: "",
          eventType: GameEventType.Timeout,
          effectStrength: 0,
        },
        timeout: 0,
      }
    }

    const turn = await game.progress()

    await this.gameRepository.save(game)

    let eventType: GameEventType

    switch (turn.turnType) {
      case TurnType.Continue:
        eventType = GameEventType.Continue
        break
      default:
        eventType = GameEventType.Normal
    }

    return {
      event: {
        turn: game.turnCount,
        text: turn.text,
        eventType,
        time: turn.effectStrength <= 0 ? undefined : turn.time,
        effectStrength: turn.effectStrength,
      },
      timeout: turn.time,
    }
  }

  async gameCatch(gameId: string) {
    const game = await this.gameRepository.get(gameId)
    if (!game) throw new Error("Game not started")

    let gameResult: GameResult

    try {
      gameResult = await game.catchFish()
    } catch (e) {
      if (e instanceof InvalidStateError) return null
      throw e
    }

    let caughtFish = null

    // const place = await this.findPlaceById(game.placeId)
    // if (!place) throw new Error("Place not found")

    if (gameResult.isSuccess) {
      caughtFish = {
        itemId: "TEST",
        length: 300,
      }
    }

    await this.gameRepository.remove(game.id)

    return { game, gameResult, caughtFish }
  }

  async findPlaceById(placeId: string): Promise<PlaceEntity | null> {
    const place = await this.placeRepository.findOneBy({ id: placeId })
    if (!place) return null
    return place
  }

  async findUserById(userId: string): Promise<UserEntity | null> {
    const user = await this.usersRepository.findOneBy({ id: userId })
    if (!user) return null
    return user
  }

  async verifySocket(token: string): Promise<UserEntity | null> {
    console.log("Starting Verify Socket")

    if (!token) {
      console.warn("Token not found")
      return null
    }

    let res: VerifiedData
    try {
      res = await this.authService.verify(token)
    } catch (e) {
      console.warn("Token verify failed", e)
      return null
    }

    const user = await this.usersRepository.findOneBy({ id: res.id })
    if (!user) {
      console.warn("User not found")
      return null
    }

    return user
  }

  async refreshUserData(socket: EpSocket): Promise<EpSocket> {
    const user = await this.usersRepository.findOneBy({ id: socket.user.id })

    if (!user) throw new Error("user not found")
    ;(socket as EpSocket).user = user
    return socket as EpSocket
  }
}
