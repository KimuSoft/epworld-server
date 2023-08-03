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
}

export type EpRequest = Request & {
  user: UserEntity
}

export enum PlaceType {
  Personal,
  World,
  Event,
}

export enum Weather {
  Sunny,
  Rainy,
  Snowy,
  // 폭염
  HeatWave,
  // 한파
  ColdWave,
}

export enum PlacePublicity {
  Public,
  Listed,
  Private,
}

export enum Rarity {
  // 물고기 아냐
  NonFish,
  // 평범
  Common,
  // 희귀
  Rare,
  // 매우 희귀
  Epic,
  // 전설
  Legendary,
  // 신화
  Mythical,
}
