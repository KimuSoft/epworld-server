import { Injectable } from "@nestjs/common";
import { User } from "../users/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import { Fish } from "./fish.entity";

@Injectable()
export class FishService {
  constructor(
    @InjectRepository(Fish)
    private fishRepository: Repository<Fish>
  ) {}

  async create(fishId: string, owner: User, deleted = false): Promise<Fish> {
    const fish = new Fish();
    fish.fishId = fishId;
    fish.owner = owner;
    fish.deleted = deleted;

    return this.fishRepository.save(fish);
  }

  async findOne(id: string, relations: string[] = []) {
    return this.fishRepository.findOne({
      where: { id },
      relations,
    });
  }

  async find(where: FindOptionsWhere<Fish> | FindOptionsWhere<Fish>[]) {
    return this.fishRepository.find({ where });
  }
}
