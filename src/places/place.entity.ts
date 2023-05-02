import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../users/user.entity";
import { Biome, Season } from "../types";
import { Facility } from "../facilities/facility.entity";

@Entity()
export class Place {
  @PrimaryGeneratedColumn("uuid")
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

  @OneToOne(() => User, (user) => user.ownPlaces)
  owner: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
