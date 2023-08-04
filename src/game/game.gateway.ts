import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets"
import { Server, Socket } from "socket.io"
import { GameService } from "./game.service"
import { EpSocket } from "./game.type"
import { getTurn, TurnType } from "../utils/gameTurn"
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter"
import { sample } from "lodash"
import { plainToInstance } from "class-transformer"
import { validate } from "class-validator"
import { JoinPlaceDto } from "./dto/join-place.dto"

const playingUser = new Set()
const clickedUser = new Set()

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

    await this.gameService.gameStart(socket.user.id, socket.placeId)

    socket.emit("game:start")
    await this.sleep(2500)
    this.eventEmitter.emit("game:progress", socket)
  }

  @OnEvent("game:progress")
  async gameProgress(socket: EpSocket) {
    const { turn } = await this.gameService.gameProgress(socket.user.id)

    if (!turn) return

    socket.emit("game:event", turn)
    await this.sleep(turn.time)
    this.eventEmitter.emit("game:progress", socket)
  }

  @SubscribeMessage("game:catch")
  async gameCatch(socket: EpSocket) {
    const { gameResult, caughtFish } = await this.gameService.gameCatch(socket.user.id)


    socket.emit("game:catch", {gameResult, caughtFish})

    // TODO: 쓰레기 낚임 이벤트
  }

  @SubscribeMessage("fish:start")
  async fishStart(_socket: EpSocket, { placeId }: { placeId: string }) {
    const socket = await this.gameService.refreshUserData(_socket)

    // 이미 낚시를 진행 중인지 확인
    if (playingUser.has(socket.id)) {
      return socket.emit("fish:error", "이미 낚시중입니다.")
    }

    // 요청하는 낚시터가 존재하는지 확인
    console.log(placeId)
    const place = await this.gameService.findPlaceById(placeId)
    console.log(place)
    if (!place) return socket.emit("fish:error", "낚시터가 존재하지 않습니다.")

    playingUser.add(socket.id)

    console.log("낚시 시작")
    socket.emit("fish:start", {
      player: {
        heart: 100,
        time: 0,
      },
    })

    // 시작 대기 시간 1초
    await this.sleep(1000)

    let time = 0

    // 낚시 루프 시작
    while (true) {
      // 일정 턴 이상이 지난 경우
      if (time >= 10) {
        socket.emit("fish:timeout", "시간 초과... 낚시 종료됨.")
        playingUser.delete(socket.id)
        return
      }

      const turn = getTurn()

      socket.emit("fish:event", {
        text: turn.text,
        emphasize: turn.type !== TurnType.Normal,
        player: { time },
      })

      // 시간 기다림
      await this.sleep(turn.time)

      // 만약 유저가 타이밍 안에 클릭을 한 경우
      if (clickedUser.has(socket.id)) {
        clickedUser.delete(socket.id)

        // 잘못된 타이밍에 클릭한 경우
        if (turn.type !== TurnType.Timing) {
          socket.emit("fish:fail", "잘못된 타이밍입니다. 낚시 종료됨.")
          playingUser.delete(socket.id)
          return
        }

        break
      }

      time++
    }

    // 물고기를 잡는 것에 성공한 경우
    socket.emit("fish:caught", {
      text:
        sample([
          "파링",
          "구이",
          "로",
          "먀스냥이",
          "용용이",
          "꿔다놓은 보릿자루",
          "천안의 명물",
          "파링",
          "별샤",
        ]) + "을(를) 잡았다!",
      player: { heart: 100, time: 0 },
    })

    // 게임 종료
    playingUser.delete(socket.id)
    console.log("낚시 종료")
  }

  @SubscribeMessage("fish:catch")
  async catch(client: Socket) {
    if (!playingUser.has(client.id)) return
    console.log("낚시 클릭")
    clickedUser.add(client.id)
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
    if (!placeId) throw new Error("낚시터에 참여하지 않았습니다.")
    const place = await this.gameService.findPlaceById(placeId)
    if (!place) throw new Error("낚시터 정보를 찾을 수 없습니다.")

    console.log("낚시터 정보 갱신", placeId)
    this.server.to(placeId).emit("refresh:place", place)
  }

  private async refreshUserData(socket: EpSocket) {
    const user = await this.gameService.findUserById(socket.user.id)
    if (!user) throw new Error("유저 정보를 찾을 수 없습니다.")
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
