import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { Place } from "../place/place.entity";
import { Fish } from "../fish/fish.entity";

@Entity()
export class User {
  @PrimaryColumn()
  id: string;

  @Column()
  username: string;

  @Column()
  avatar: string;

  @Column()
  money: number;

  @Column()
  exp: number;

  @OneToMany(() => Place, (place) => place.owner)
  ownPlaces: Place[];

  @OneToMany(() => Fish, (fish) => fish.owner)
  fish: Fish[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
