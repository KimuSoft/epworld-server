import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Place } from "../places/place.entity";
import { z } from "zod";
import { createZodDto } from "nestjs-zod";

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

export const facilitySchema = z.object({
  id: z.string().uuid(),
  facilityId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  place: z.string().uuid(),
});

export class FacilitiesDto extends createZodDto(facilitySchema) {}
