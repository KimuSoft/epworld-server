import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Facility } from "./entities/facility.entity"

@Injectable()
export class FacilitiesService {
  constructor(
    @InjectRepository(Facility)
    private facilityRepository: Repository<Facility>
  ) {}

  async findById(
    id: string,
    relations: string[] = []
  ): Promise<Facility | null> {
    return this.facilityRepository.findOne({ where: { id }, relations })
  }
}
