import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsUrl, Length } from "class-validator"

export class CreateUserDto {
  @ApiProperty({ description: "유저의 이름" })
  @IsString()
  @Length(1, 64)
  username: string

  @ApiProperty({ description: "유저의 아바타 이미지 URL" })
  @IsUrl()
  avatar: string
}
