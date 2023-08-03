import { Injectable } from "@nestjs/common"
import { UserEntity } from "../users/user.entity"
import { JwtService } from "@nestjs/jwt"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private jwtService: JwtService
  ) {}

  async validateUser(
    accountType: string,
    id: string,
    username: string,
    avatar: string
  ): Promise<UserEntity> {
    const userId = `${accountType}:${id}`
    const user = await this.usersRepository.findOneBy({ id: userId })

    if (user) {
      user.username = username
      user.avatar = avatar
      return this.usersRepository.save(user)
    } else {
      // 처음 가입한 유저의 경우 새로 생성
      return this.createUser(userId, username, avatar)
    }
  }

  private async createUser(userId: string, username: string, avatar: string) {
    const user = new UserEntity()
    user.id = userId
    user.username = username
    user.avatar = avatar

    await this.usersRepository.save(user)
    return user
  }

  async login(user: UserEntity, isBot = false) {
    const payload = { id: user.id, isBot }
    return { accessToken: await this.jwtService.signAsync(payload) }
  }

  async logout() {
    return
  }

  async verify(token: string) {
    return this.jwtService.verifyAsync(token)
  }

  async sign(payload: any) {
    return this.jwtService.signAsync(payload)
  }
}
