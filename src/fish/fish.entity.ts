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

  toJSON() {
    return {
      id: this.id,
      fishId: this.fishId,
      deleted: this.deleted,
      length: this.length,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      owner: this.owner?.id || this.owner,
    };
  }
}
