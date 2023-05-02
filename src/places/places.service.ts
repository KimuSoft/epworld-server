import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Place } from "./place.entity";
import { User } from "../users/user.entity";

@Injectable()
export class PlacesService {
  constructor(
    @InjectRepository(Place)
    private placeRepository: Repository<Place>
  ) {}

  async create(name: string, owner: User, description = "", id?: string) {
    const place = new Place();
    if (id) place.id = id;
    place.name = name;
    place.description = description;
    place.owner = owner;

    return this.placeRepository.save(place);
  }

  async findOne(id: string, relations: string[] = []) {
    return this.placeRepository.findOne({
      where: { id },
      relations,
    });
  }

  async update(id: string, name?: string, description?: string) {
    // console.log(blocksChange)
    const place = await this.findOne(id);

    if (name !== undefined) place.name = name;
    if (description !== undefined) place.description = description;

    await this.placeRepository.save(place);
  }

  async save(place: Place) {
    return this.placeRepository.save(place);
  }

  async getPlaceJSON(place: Place) {
    return {
      // ID 및 이름 정보
      id: place.id,
      name: place.name,
      description: place.description,

      // 낚시터 게임 정보
      cleans: place.cleans,
      exp: place.exp,
      capital: place.capital,
      fee: place.fee,

      season: place.season,
      biome: place.biome,

      // 낚시터 소유 정보
      owner: place.owner,
    };
  }
}
