import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Place } from "./place.entity";
import { User } from "../users/user.entity";
import { Facility } from "../facilities/facility.entity";

@Injectable()
export class PlacesService {
  constructor(
    @InjectRepository(Place)
    private placeRepository: Repository<Place>,
    @InjectRepository(Facility)
    private facilityRepository: Repository<Facility>,
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async create(name: string, ownerId: string, description = "", id?: string) {
    const place = new Place();
    if (id) place.id = id;
    place.name = name;
    place.description = description;

    const owner = await this.usersRepository.findOneBy({ id: ownerId });
    if (!owner) throw new NotFoundException("Owner not found");
    place.owner = owner;

    return this.placeRepository.save(place);
  }

  async findById(id: string, relations: string[] = []) {
    return this.placeRepository.findOne({
      where: { id },
      relations,
    });
  }

  async update(id: string, name?: string, description?: string) {
    // console.log(blocksChange)
    const place = await this.findById(id);

    if (name !== undefined) place.name = name;
    if (description !== undefined) place.description = description;

    return this.placeRepository.save(place);
  }

  async save(place: Place) {
    return this.placeRepository.save(place);
  }

  async build(id, facilityId) {
    const place = await this.findById(id, ["facilities"]);
    if (place.facilities.map((f) => f.facilityId).includes(facilityId))
      throw new Error("AlreadyBuilt");

    const facility = new Facility();
    facility.facilityId = facilityId;
    facility.place = place;

    return this.facilityRepository.save(facility);
  }

  async buy(userId: string, placeId: string, amount: number) {
    const place = await this.findById(placeId);
    if (!place) throw new NotFoundException("Place not found");

    const newOwner = await this.usersRepository.findOneBy({ id: userId });
    if (!newOwner) throw new NotFoundException("User not found");

    if (amount <= 0) throw new ForbiddenException({ error: "InvalidAmount" });

    if (newOwner.money < amount)
      throw new ForbiddenException({ error: "NotEnoughMoney" });

    const oldOwner = place.owner;
    if (oldOwner.id === newOwner.id) {
      newOwner.money -= amount;
      place.price += amount;

      await this.usersRepository.save(newOwner);
      await this.placeRepository.save(place);
    } else {
      oldOwner.money += place.price;
      newOwner.money -= amount;
      place.owner = newOwner;
      place.price = amount;

      await this.usersRepository.save(oldOwner);
      await this.usersRepository.save(newOwner);
      await this.placeRepository.save(place);
    }
  }

  async getFacilities(placeId: string) {
    const place = await this.findById(placeId, ["facilities"]);
    return place.facilities;
  }

  async destroyFacility(placeId: string, facilityId: string) {
    const facility = await this.facilityRepository.findOne({
      where: { id: facilityId },
      relations: ["place"],
    });
    if (!facility) throw new NotFoundException("Facility not found");

    if (facility.place.id !== placeId)
      throw new ForbiddenException({ error: "NotYourFacility" });

    return this.facilityRepository.remove(facility);
  }
}
