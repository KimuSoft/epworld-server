import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Place } from "../places/place.entity";

@Entity()
export class Facility {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  facilityId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Place, (place) => place.facilities, {
    onDelete: "CASCADE",
  })
  place: Place;

  toJSON() {
    return {
      id: this.id,
      facilityId: this.facilityId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      place: this.place?.id || this.place,
    };
  }
}
