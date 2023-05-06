import { Socket } from "socket.io";
import { User } from "../users/user.entity";

export interface EpSocket extends Socket {
  user: User;
}

export interface VerifiedData {
  id: string;
  iat: number;
  exp: number;
}
