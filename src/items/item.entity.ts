import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from "typeorm"
import { UserEntity } from "../users/user.entity"

@Entity("item")
export class ItemEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  itemId: string

  // 메타데이터

  @Column()
  length?: number

  // 주인 정보 (릴레이션)

  @ManyToOne(() => UserEntity, (user) => user.items, {
    onDelete: "CASCADE",
  })
  owner: UserEntity

  @RelationId((item: ItemEntity) => item.owner)
  ownerId: string

  // 생성 및 삭제일시

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date | null
}
