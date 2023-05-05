import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
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

  @OneToMany(() => Facility, (facility) => facility.place, {
    cascade: true,
  })
  facilities: Facility[];

  @OneToOne(() => User, (user) => user.places)
  owner: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      cleans: this.cleans,
      exp: this.exp,
      capital: this.capital,
      season: this.season,
      biome: this.biome,
      price: this.price,
      fee: this.fee,
    };
  }
}
