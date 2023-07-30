import { Request } from "express"
import { UserEntity } from "./users/user.entity"

export enum Season {
  Spring,
  Summer,
  Autumn,
  Winter,
}

export enum Biome {
  Desert,
  Beach,
  River,
  Lake,
  Mountain,
  Marsh,
  Foreshore,
  Headland,
  Bay,
  Fountain,
  Caldera,
}

export type EpRequest = Request & {
  user: UserEntity
}
