import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Like, Repository } from "typeorm"
import { PlaceEntity } from "./place.entity"
import { UserEntity } from "../users/user.entity"
import { Facility } from "../facilities/entities/facility.entity"
import { CreatePlaceDto } from "./dto/create-place.dto"
import { Cron } from "@nestjs/schedule"
import { SearchPlaceQueryDto } from "./dto/search-place-query.dto"

@Injectable()
export class PlacesService {
  constructor(
    @InjectRepository(PlaceEntity)
    private placeRepository: Repository<PlaceEntity>,
    @InjectRepository(Facility)
    private facilityRepository: Repository<Facility>,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>
  ) {}

  async searchPlaces(
    { q, start, limit }: SearchPlaceQueryDto,
    userId: string
  ): Promise<PlaceEntity[]> {
    // 해당 문자열이 포함되어 있고, (publicity가 2보다 낮거나, ownerId가 본인의 id인 경우)
    return this.placeRepository.query(
      `SELECT * FROM place WHERE ${
        q ? `"name" LIKE '%${q.replace(/'"\*/g, "")}%' AND` : ""
      } (publicity < 2 OR "ownerId" = '${userId}') LIMIT ${
        limit || 20
      } OFFSET ${start || 0}`
    )
  }

  async createPlace(
    userId: string,
    { name, description }: CreatePlaceDto
  ): Promise<PlaceEntity> {
    const place = new PlaceEntity()
    place.name = name
    place.description = description

    const owner = await this.usersRepository.findOneBy({ id: userId })
    if (!owner) throw new NotFoundException("Owner not found")
    place.owner = owner

    return this.placeRepository.save(place)
  }

  async findPlaceById(id: string, relations: string[] = []) {
    return this.placeRepository.findOne({
      where: { id },
      relations,
    })
  }

  async updatePlace(id: string, name?: string, description?: string) {
    // console.log(blocksChange)
    const place = await this.findPlaceById(id)

    if (name !== undefined) place.name = name
    if (description !== undefined) place.description = description

    return this.placeRepository.save(place)
  }

  async save(place: PlaceEntity) {
    return this.placeRepository.save(place)
  }

  async build(id, facilityId) {
    const place = await this.findPlaceById(id, ["facilities"])
    if (place.facilities.map((f) => f.facilityId).includes(facilityId))
      throw new Error("AlreadyBuilt")

    const facility = new Facility()
    facility.facilityId = facilityId
    facility.place = place

    return this.facilityRepository.save(facility)
  }

  async buy(userId: string, placeId: string, amount: number) {
    const place = await this.findPlaceById(placeId)
    if (!place) throw new NotFoundException("Place not found")

    const newOwner = await this.usersRepository.findOneBy({ id: userId })
    if (!newOwner) throw new NotFoundException("User not found")

    if (amount <= 0) throw new ForbiddenException({ error: "InvalidAmount" })

    if (newOwner.money < amount)
      throw new ForbiddenException({ error: "NotEnoughMoney" })

    const oldOwner = place.owner
    if (oldOwner.id === newOwner.id) {
      newOwner.money -= amount
      place.price += amount

      await this.usersRepository.save(newOwner)
      await this.placeRepository.save(place)
    } else {
      oldOwner.money += place.price
      newOwner.money -= amount
      place.owner = newOwner
      place.price = amount

      await this.usersRepository.save(oldOwner)
      await this.usersRepository.save(newOwner)
      await this.placeRepository.save(place)
    }
  }

  async getFacilities(placeId: string) {
    const place = await this.findPlaceById(placeId, ["facilities"])
    return place.facilities
  }

  async destroyFacility(placeId: string, facilityId: string) {
    const facility = await this.facilityRepository.findOne({
      where: { id: facilityId },
      relations: ["place"],
    })
    if (!facility) throw new NotFoundException("Facility not found")

    if (facility.place.id !== placeId)
      throw new ForbiddenException({ error: "NotYourFacility" })

    return this.facilityRepository.remove(facility)
  }

  @Cron("0 0 0 * * *")
  async updatePlaceSeason() {
    await this.placeRepository.update({}, { season: () => "season + 1" })
  }
}
