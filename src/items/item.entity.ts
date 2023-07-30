import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { UserEntity } from "../users/user.entity"
import { z } from "zod"

@Entity("item")
export class ItemEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  itemId: string

  @Column()
  length: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date | null

  @ManyToOne(() => UserEntity, (user) => user.items, {
    onDelete: "CASCADE",
  })
  owner: UserEntity

  toJSON() {
    return {
      id: this.id,
      itemId: this.itemId,
      length: this.length,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
      owner: this.owner?.id || this.owner,
    }
  }
}

export const itemSchema = z.object({
  id: z.string().uuid(),
  itemId: z.string(),
  length: z.number().positive(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
  owner: z.string().uuid(),
})
