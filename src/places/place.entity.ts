import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  RelationId,
  UpdateDateColumn,
} from "typeorm"
import { UserEntity } from "../users/user.entity"
import { Biome, PlacePublicity, PlaceType, Season, Weather } from "../types"
import { Facility } from "../facilities/facility.entity"
import { v4 } from "uuid"
import { pmfChoice } from "../utils/random"
import { sample } from "lodash"

@Entity("place")
export class PlaceEntity {
  // 기존 정보

  @PrimaryColumn()
  id: string = v4()

  @Column()
  name: string

  @Column({ default: "" })
  description: string

  @Column({ default: PlacePublicity.Private })
  publicity: PlacePublicity

  @Column({ default: PlaceType.Personal })
  placeType: PlaceType

  // 기본 정보 (릴레이션)

  @ManyToOne(() => UserEntity, (user) => user.places)
  owner: UserEntity

  @RelationId((place: PlaceEntity) => place.owner)
  ownerId: string

  @OneToMany(() => Facility, (facility) => facility.place, {
    cascade: true,
  })
  facilities: Facility[]

  @RelationId((place: PlaceEntity) => place.facilities)
  facilityIds: string[]

  // 낚시터 스테이터스

  @Column({ default: 0 })
  exp: number

  @Column({ default: 0 })
  cleans: number

  @Column({ default: 0 })
  capital: number

  @Column({ default: 0 })
  price: number

  @Column({ default: 5 })
  fee: number

  // 낚시터 환경

  @Column({ default: Biome.Beach })
  biome: Biome = pickBiome()

  @Column({ default: Season.Spring })
  season: Season = pickSeason()

  @Column({ default: Weather.Sunny })
  weather: Weather

  // 생성 및 업데이트 정보

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt?: Date
}

function pickBiome() {
  return pmfChoice([
    { object: Biome.Beach, frequency: 0.4 },
    { object: Biome.River, frequency: 0.4 },
    { object: Biome.Lake, frequency: 0.2 },
  ]).object
}

function pickSeason() {
  return sample([Season.Spring, Season.Summer, Season.Autumn, Season.Winter])
}
