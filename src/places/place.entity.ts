import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../users/user.entity";
import { Biome, Season } from "../types";
import { Facility } from "../facilities/facility.entity";
import { v4 } from "uuid";

@Entity()
export class Place {
  @PrimaryColumn({ default: v4() })
  id: string;

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
  season: Season;

  // 지형
  @Column({ default: Biome.Beach })
  biome: Biome;

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

  @ManyToOne(() => User, (user) => user.places)
  owner: User;

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
