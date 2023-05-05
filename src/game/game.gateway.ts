import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({ cors: { origin: "*" } })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  //소켓 연결시 유저목록에 추가
  public handleConnection(client: Socket): void {
    console.log("connected", client.id);
  }

  //소켓 연결 해제시 유저목록에서 제거
  public handleDisconnect(client: Socket): void {
    console.log("disconnected", client.id);
  }

  @SubscribeMessage("sendMessage")
  sendMessage(client: Socket, message: string): void {
    console.log("메시징", client.id, message);
    // client.rooms.forEach((roomId) =>
    //   client.to(roomId).emit("getMessage", {
    //     id: client.id,
    //     nickname: client.data.nickname,
    //     message,
    //   })
    // );
  }

  @SubscribeMessage("fish")
  fishStart(client: Socket): void {
    console.log("낚시 시작");
    client.emit("fish", { msg: "호애앵" });
  }
}
