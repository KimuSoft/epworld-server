import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { Place } from "../places/place.entity";
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
  places: Place[];

  @OneToMany(() => Fish, (fish) => fish.owner)
  fish: Fish[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  toJSON() {
    return {
      id: this.id,
      username: this.username,
      avatar: this.avatar,
      money: this.money,
      exp: this.exp,
    };
  }
}
