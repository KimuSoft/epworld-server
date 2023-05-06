import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import * as _ from "lodash";
import { GameService } from "./game.service";
import { EpSocket } from "./game.type";
import { PlacesService } from "../places/places.service";
import { getTurn, TurnType } from "../utils/gameTurn";

const playingUser = new Set();
const clickedUser = new Set();

@WebSocketGateway({ cors: { origin: "*" } })
export class GameGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(
    private gameService: GameService,
    private placesService: PlacesService
  ) {}

  @WebSocketServer()
  server: Server;

  public async handleConnection(client: EpSocket) {
    await this.gameService.socketVerify(client);
  }

  public handleDisconnect(client: Socket): void {
    console.log("disconnected", client.id);
  }

  public afterInit() {
    console.info("GameGateway Init");
  }

  @SubscribeMessage("sendMessage")
  sendMessage(socket: EpSocket, message: string) {
    console.info("sendMessage", socket.user.username, message);
    socket.broadcast.emit("message", { author: socket.user, message });
    socket.emit("messageSubmitted", true);
  }

  @SubscribeMessage("fish")
  async fishStart(_socket: EpSocket, { placeId }: { placeId: string }) {
    const socket = await this.gameService.refreshUserData(_socket);

    // 이미 낚시를 진행 중인지 확인
    if (playingUser.has(socket.id)) {
      return socket.emit("fishError", "이미 낚시중입니다.");
    }

    // 요청하는 낚시터가 존재하는지 확인
    const place = await this.placesService.findById(placeId);
    if (!place) return socket.emit("fishError", "낚시터가 존재하지 않습니다.");

    playingUser.add(socket.id);

    console.log("낚시 시작");
    socket.emit("fishStart", {
      player: {
        heart: 100,
        time: 0,
      },
    });

    // 시작 대기 시간 1초
    await this.sleep(1000);

    let time = 0;

    // 낚시 루프 시작
    while (true) {
      // 일정 턴 이상이 지난 경우
      if (time >= 10) {
        socket.emit("fishTimeOut", "시간 초과... 낚시 종료됨.");
        playingUser.delete(socket.id);
        return;
      }

      const turn = getTurn();

      socket.emit("fish", {
        text: turn.text,
        player: { time },
      });

      // 시간 기다림
      await this.sleep(turn.time);

      // 만약 유저가 타이밍 안에 클릭을 한 경우
      if (clickedUser.has(socket.id)) {
        clickedUser.delete(socket.id);

        // 잘못된 타이밍에 클릭한 경우
        if (turn.type !== TurnType.Timing) {
          socket.emit("failToCatch", "잘못된 타이밍입니다. 낚시 종료됨.");
          playingUser.delete(socket.id);
          return;
        }

        break;
      }

      time++;
    }

    // 물고기를 잡는 것에 성공한 경우
    socket.emit("fishCaught", {
      text: _.sample(["파링", "구이", "로"]) + "을(를) 잡았다!",
      player: { heart: 100, time: 0 },
    });

    // 게임 종료
    playingUser.delete(socket.id);
    console.log("낚시 종료");
  }

  @SubscribeMessage("catch")
  async catch(client: Socket) {
    console.log("낚시 클릭");
    clickedUser.add(client.id);
  }

  async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
