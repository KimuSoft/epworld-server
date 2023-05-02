import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async findOne(id: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async update(id: string, username: string, avatar: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    user.username = username;
    user.avatar = avatar;
    return this.usersRepository.save(user);
  }

  async create(id: string, username: string, avatar: string): Promise<User> {
    const user = new User();
    user.id = id;
    user.username = username;
    user.avatar = avatar;

    return this.usersRepository.save(user);
  }

  async save(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  async getJSON(user: User) {
    return {
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      money: user.money,
      exp: user.exp,
    };
  }
}
