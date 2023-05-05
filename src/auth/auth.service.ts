import { Injectable } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { User } from "../users/user.entity";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(
    accountType: string,
    id: string,
    username: string,
    avatar: string
  ): Promise<User> {
    const userId = `${accountType}:${id}`;
    const user = await this.usersService.findById(userId);
    if (user) return this.usersService.update(userId, username, avatar);

    // 처음 가입한 유저의 경우 새로 생성
    return this.usersService.create(userId, username, avatar);
  }

  async login(user: User) {
    const payload = { id: user.id };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async logout() {}
}
