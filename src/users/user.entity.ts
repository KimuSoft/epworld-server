import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm"
import { PlaceEntity } from "../places/place.entity"
import { ItemEntity } from "../item/item.entity"

@Entity("user")
export class UserEntity {
  @PrimaryColumn()
  id: string

  @Column()
  username: string

  @Column({ nullable: true })
  avatar: string

  @Column({ default: 0 })
  money: number

  @Column({ default: 0 })
  exp: number

  @OneToMany(() => PlaceEntity, (place) => place.owner)
  places: PlaceEntity[]

  @OneToMany(() => ItemEntity, (item) => item.owner)
  items: ItemEntity[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @Column({ default: false })
  admin: boolean

  toJSON() {
    return {
      id: this.id,
      username: this.username,
      avatar: this.avatar,
      money: this.money,
      exp: this.exp,
      places: this.places?.map((place) => place.toJSON()) || this.places,
      items: this.items?.map((item) => item.toJSON()) || this.items,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      admin: this.admin,
    }
  }
}
