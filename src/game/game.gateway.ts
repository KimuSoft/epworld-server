import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import _ from "lodash";
import { GameService } from "./game.service";
import { EpSocket } from "./game.type";

const playingUser = new Set();
const clickedUser = new Set();

@WebSocketGateway({ cors: { origin: "*" } })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private gameService: GameService) {}

  @WebSocketServer()
  server: Server;

  public async handleConnection(client: EpSocket) {
    await this.gameService.socketVerify(client);
  }

  public handleDisconnect(client: Socket): void {
    console.log("disconnected", client.id);
  }

  @SubscribeMessage("sendMessage")
  sendMessage(client: EpSocket, message: string) {
    console.log("메시징", client.user.username, message);
    // client.rooms.forEach((roomId) =>
    //   client.to(roomId).emit("getMessage", {
    //     id: client.id,
    //     nickname: client.data.nickname,
    //     message,
    //   })
    // );
  }

  @SubscribeMessage("fish")
  async fishStart(client: Socket) {
    // 플레이중인 지 확인
    if (playingUser.has(client.id)) {
      return client.emit("fishError", "이미 낚시중입니다.");
    }

    playingUser.add(client.id);

    console.log("낚시 시작");
    client.emit("fishStart", {
      player: {
        heart: 100,
        time: 0,
      },
    });

    // 시작 대기 시간 1초
    await new Promise((resolve) => setTimeout(resolve, 1000));

    while (true) {
      client.emit("fish", {
        text: _.sample(["기다리세요...", "느낌이 왔다!"]),
        player: { heart: 100, time: 0 },
      });

      // 시간 기다림
      await new Promise((resolve) =>
        setTimeout(resolve, 400 * (Math.random() * 3 + 1))
      );

      if (clickedUser.has(client.id)) {
        clickedUser.delete(client.id);
        break;
      }
    }

    client.emit("fishCaught", {
      text: _.sample(["파링", "구이", "로"]) + "을(를) 잡았다!",
      player: { heart: 100, time: 0 },
    });

    // 게임 종료
    playingUser.delete(client.id);
    console.log("낚시 종료");
  }

  @SubscribeMessage("fishClick")
  async fishClick(client: Socket) {
    console.log("낚시 클릭");
    clickedUser.add(client.id);
  }
}
