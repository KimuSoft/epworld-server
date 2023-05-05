import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../users/user.entity";

@Entity()
export class Fish {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  fishId: string;

  @Column({ default: false })
  deleted: boolean;

  @Column()
  length: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.fish, {
    onDelete: "CASCADE",
  })
  owner: User;
}
