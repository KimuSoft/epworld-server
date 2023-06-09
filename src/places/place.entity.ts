import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserEntity } from "../users/user.entity";
import { Biome, Season } from "../types";
import { Facility } from "../facilities/facility.entity";
import { v4 } from "uuid";
import { pmfChoice } from "../utils/random";
import * as _ from "lodash";
import { z } from "zod";

@Entity("place")
export class PlaceEntity {
  @PrimaryColumn()
  id: string = v4();

  // 낚시터 이름
  @Column()
  name: string;

  // 청결도
  @Column({ default: 0 })
  cleans: number;

  @Column({ default: 0 })
  exp: number;

  @Column({ default: 0 })
  capital: number;

  // 낚시터 설명
  @Column({ default: "" })
  description: string;

  // 계절
  @Column({ default: Season.Spring })
  season: Season = pickSeason();

  // 지형
  @Column({ default: Biome.Beach })
  biome: Biome = pickBiome();

  // 땅값
  @Column({ default: 0 })
  price: number;

  // 수수료 (%)
  @Column({ default: 5 })
  fee: number;

  // 날씨
  @Column({ default: 0 })
  weather: number;

  @OneToMany(() => Facility, (facility) => facility.place, {
    cascade: true,
  })
  facilities: Facility[];

  @ManyToOne(() => UserEntity, (user) => user.places)
  owner: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  toJSON() {
    return {
      // ID 및 이름 정보
      id: this.id,
      name: this.name,
      description: this.description,

      // 낚시터 게임 정보
      cleans: this.cleans,
      exp: this.exp,
      capital: this.capital,
      fee: this.fee,

      season: this.season,
      biome: this.biome,

      // 낚시터 소유 정보
      owner: this.owner?.id || this.owner,
    };
  }
}
function pickBiome() {
  return pmfChoice([
    {
      object: Biome.Beach,
      frequency: 0.4,
    },
    {
      object: Biome.River,
      frequency: 0.4,
    },
    {
      object: Biome.Lake,
      frequency: 0.2,
    },
  ]).object as number;
}

function pickSeason() {
  return _.sample([Season.Spring, Season.Summer, Season.Autumn, Season.Winter]);
}

export const placeSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  cleans: z.number(),
  exp: z.number(),
  capital: z.number(),
  description: z.string(),
  season: z.nativeEnum(Season),
  biome: z.nativeEnum(Biome),
  price: z.number(),
  fee: z.number(),
  // weather: z.nativeEnum(Wheather),
  createdAt: z.date(),
  updatedAt: z.date(),
  owner: z.string().uuid(),
});
