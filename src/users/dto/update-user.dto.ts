import { IsOptional, IsString, IsUrl, Length } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class UpdateUserDto {
  @ApiProperty({ description: "유저의 이름", required: false })
  @IsOptional()
  @IsString()
  @Length(1, 64)
  username?: string

  @ApiProperty({ description: "유저의 아바타 이미지 URL", required: false })
  @IsOptional()
  @IsUrl()
  avatar?: string
}
