import { Injectable } from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
import { Socket } from "socket.io";
import { UsersService } from "../users/users.service";
import { EpSocket, VerifiedData } from "./game.type";
import { PlacesService } from "../places/places.service";

@Injectable()
export class GameService {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private placesService: PlacesService
  ) {}

  async socketVerify(socket: Socket): Promise<EpSocket | void> {
    console.log("Verify Socket");
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

  async refreshUserData(socket: EpSocket): Promise<EpSocket> {
    const user = await this.usersService.findById(socket.user.id);

    if (!user) throw new Error("user not found");

    (socket as EpSocket).user = user;
    return socket as EpSocket;
  }
}
