import { Injectable } from "@nestjs/common";
import { User } from "../users/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import { Item } from "./item.entity";

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private itemRepository: Repository<Item>
  ) {}

  async create(fishId: string, owner: User, deleted = false): Promise<Item> {
    const item = new Item();
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

  async find(where: FindOptionsWhere<Item> | FindOptionsWhere<Item>[]) {
    return this.itemRepository.find({ where });
  }
}
