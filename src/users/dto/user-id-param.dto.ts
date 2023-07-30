import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class UserIdParamDto {
  @ApiProperty({
    description: "유저의 ID",
  })
  @IsString()
  id: string
}
