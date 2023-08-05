import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from "@nestjs/websockets"
import { Server, Socket } from "socket.io"
import { GameService } from "./game.service"
import { EpSocket } from "./game.type"
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter"
import { plainToInstance } from "class-transformer"
import { validate } from "class-validator"
import { JoinPlaceDto } from "./dto/join-place.dto"
import { GameEventType } from "./dto/game-event.dto"

@WebSocketGateway({ cors: { origin: "*" } })
export class GameGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(
    private eventEmitter: EventEmitter2,
    private readonly gameService: GameService
  ) {}

  @WebSocketServer()
  server: Server

  /* 연결 이벤트 */

  public async handleConnection(socket: EpSocket) {
    const token: string = socket.handshake.auth.token
    const user = await this.gameService.verifySocket(token)

    if (!user) return socket.disconnect()

    socket.user = user
    this.joinPlace(
      socket,
      await this.gameService.getRecentPlaceId(user.id)
    ).then()
  }

  public handleDisconnect(client: Socket): void {
    console.log("disconnected", client.id)
  }

  public afterInit() {
    console.info("GameGateway Init")
  }

  /* 소켓 일반 이벤트 */

  @SubscribeMessage("join")
  async join(socket: EpSocket, body: any) {
    const joinPlaceDto = await this.validateBody(JoinPlaceDto, body, socket)
    if (!joinPlaceDto) return

    if (
      !(await this.gameService.checkPlaceIsJoinable(
        socket.user.id,
        joinPlaceDto.placeId
      ))
    ) {
      return socket.emit("error", "낚시터에 참여할 수 없습니다.")
    }

    this.joinPlace(socket, joinPlaceDto.placeId).then()
  }

  private async joinPlace(socket: EpSocket, placeId: string) {
    console.log("join", socket.user.username, placeId)
    await this.gameService.changeRecentPlace(socket.user.id, placeId)

    for (const room of Object.keys(socket.rooms)) {
      if (room !== socket.id) await socket.leave(room)
    }

    console.log(socket.rooms)
    await socket.join(placeId)
    socket.placeId = placeId

    console.log(socket.rooms)

    this.refreshPlaceData(socket).then()
  }

  @SubscribeMessage("message:send")
  sendMessage(socket: EpSocket, message: string) {
    if (!socket.placeId) {
      return socket.emit("error", "낚시터에 참여하지 않았습니다.")
    }

    console.info("message:send", socket.placeId, socket.user.username, message)

    this.server
      .to(socket.placeId)
      .emit("message:on", { author: socket.user, content: message })
    socket.emit("message:submitted")
  }

  /* 소켓 게임 이벤트 */

  @SubscribeMessage("game:start")
  async gameStart(socket: EpSocket) {
    if (!socket.placeId)
      return socket.emit("error", "낚시터에 참여하지 않았습니다.")

    const game = await this.gameService.gameStart(
      socket.user.id,
      socket.placeId
    )

    if (!game) throw new WsException("게임을 시작할 수 없습니다.")

    socket.emit("game:start")
    await this.sleep(2500)
    this.eventEmitter.emit("game:progress", socket)
  }

  @SubscribeMessage("game:cancel")
  async cancelGame(socket: EpSocket) {
    try {
      await this.gameService.cancelGame(socket.user.id)
    } catch (e) {
      throw new WsException(e.message)
    }
    socket.emit("game:cancel")
  }

  @OnEvent("game:progress")
  async gameProgress(socket: EpSocket) {
    const turnEventDto = await this.gameService.gameProgress(socket.user.id)
    if (!turnEventDto) return

    const time = turnEventDto.time

    // 일반 낚시 상태에서는 시간 정보를 숨김
    if (turnEventDto.eventType === GameEventType.Normal) {
      turnEventDto.time = undefined
    }

    socket.emit("game:event", turnEventDto)

    await this.sleep(time)
    this.eventEmitter.emit("game:progress", socket)
  }

  @SubscribeMessage("game:continue")
  async continueGame(socket: EpSocket) {
    const game = await this.gameService.continueGame(socket.user.id)
    if (!game) return

    this.eventEmitter.emit("game:progress", socket)
  }

  @SubscribeMessage("game:catch")
  async gameCatch(socket: EpSocket) {
    const catchResult = await this.gameService.gameCatch(socket.user.id)

    if (!catchResult) return

    if (!catchResult.gameResult.isSuccess) {
      return socket.emit("game:fail", { gameResult: catchResult.gameResult })
    }

    socket.emit("game:success", {
      gameResult: catchResult.gameResult,
      catchResult: catchResult.caughtFish,
    })

    // TODO: 쓰레기 낚임 이벤트
  }

  /* 정보 갱신 요청 */

  @SubscribeMessage("refresh")
  async refresh(socket: EpSocket) {
    await this.refreshPlaceData(socket)
    await this.refreshUserData(socket)
  }

  @SubscribeMessage("refresh:place")
  async refreshPlace(socket: EpSocket) {
    await this.refreshPlaceData(socket)
  }

  @SubscribeMessage("refresh:user")
  async refreshUser(socket: EpSocket) {
    await this.refreshUserData(socket)
  }

  /* 핑 */

  @SubscribeMessage("ping")
  ping(client: Socket) {
    console.log("ping")
    client.emit("pong")
  }

  /* 유틸 */

  // 같은 방에 있는 모든 유저에게 갱신을 요청함
  private async refreshPlaceData(socket: EpSocket) {
    const placeId = socket.placeId
    if (!placeId) throw new WsException("낚시터에 참여하지 않았습니다.")
    const place = await this.gameService.findPlaceById(placeId)
    if (!place) throw new WsException("낚시터 정보를 찾을 수 없습니다.")

    console.log("낚시터 정보 갱신", placeId)
    this.server.to(placeId).emit("refresh:place", place)
  }

  private async refreshUserData(socket: EpSocket) {
    const user = await this.gameService.findUserById(socket.user.id)
    if (!user) throw new WsException("유저 정보를 찾을 수 없습니다.")
    socket.user = user
    socket.emit("refresh:user", user)
  }

  private async validateBody<T extends { new (): any }>(
    schema: T,
    body: any,
    socket?: EpSocket
  ): Promise<InstanceType<T> | null> {
    const dto = plainToInstance(schema, body)
    const errors = await validate(dto)
    if (errors.length > 0) {
      if (socket) {
        socket.emit("error", errors)
        return null
      } else throw errors
    }
    return dto
  }

  private async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}
