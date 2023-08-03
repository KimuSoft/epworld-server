import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  RelationId,
  UpdateDateColumn,
} from "typeorm"
import { PlaceEntity } from "../places/place.entity"
import { ItemEntity } from "../items/item.entity"

@Entity("user")
export class UserEntity {
  // 계정 정보

  @PrimaryColumn()
  id: string

  @Column()
  username: string

  @Column({ nullable: true })
  avatar: string

  @Column({ default: false })
  admin: boolean

  // 게임 정보

  @Column({ default: 0 })
  money: number

  @Column({ default: 0 })
  exp: number

  @Column({ nullable: true })
  recentPlaceId: string | null

  // 게임 정보 (릴레이션)

  @OneToMany(() => PlaceEntity, (place) => place.owner)
  places: PlaceEntity[]

  @RelationId((user: UserEntity) => user.places)
  placeIds: string[]

  @OneToMany(() => ItemEntity, (item) => item.owner)
  items: ItemEntity[]

  @RelationId((user: UserEntity) => user.items)
  itemIds: string[]

  // 게임 정보 (응용 필드)

  get level(): number {
    return this.exp / 100
  }

  // 생성 및 업데이트 정보

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
