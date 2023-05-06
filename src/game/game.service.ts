import { Injectable } from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
import { Socket } from "socket.io";
import { UsersService } from "../users/users.service";
import { EpSocket, VerifiedData } from "./game.type";

@Injectable()
export class GameService {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  async socketVerify(socket: Socket): Promise<EpSocket | void> {
    const token: string = socket.handshake.auth.token;

    let res: VerifiedData;
    try {
      res = await this.authService.verify(token);
    } catch (e) {
      socket.emit("VerifyError", e.message);
      socket.disconnect();
      return;
    }

    const user = await this.usersService.findById(res.id);
    if (!user) {
      socket.emit("VerifyError", "user not found");
      socket.disconnect();
      return;
    }

    (socket as EpSocket).user = user;
    return socket as EpSocket;
  }
}
