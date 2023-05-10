import { Injectable } from "@nestjs/common";
import { UserEntity } from "../users/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import { ItemEntity } from "./item.entity";

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(ItemEntity)
    private itemRepository: Repository<ItemEntity>
  ) {}

  async create(
    fishId: string,
    owner: UserEntity,
    deleted = false
  ): Promise<ItemEntity> {
    const item = new ItemEntity();
    item.itemId = fishId;
    item.owner = owner;
    if (deleted) item.deletedAt = new Date();

    return this.itemRepository.save(item);
  }

  async findById(id: string, relations: string[] = []) {
    console.log(relations);
    return this.itemRepository.findOne({
      where: { id },
      relations,
    });
  }

  async find(
    where: FindOptionsWhere<ItemEntity> | FindOptionsWhere<ItemEntity>[]
  ) {
    return this.itemRepository.find({ where });
  }
}
