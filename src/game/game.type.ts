import { Socket } from "socket.io"
import { UserEntity } from "../users/user.entity"

export interface EpSocket extends Socket {
  user: UserEntity
}

export interface VerifiedData {
  id: string
  iat: number
  exp: number
}
