import { ApiProperty } from "@nestjs/swagger"
import { IsString, Length } from "class-validator"

export class CreatePlaceDto {
  @ApiProperty({ description: "낚시터 이름" })
  @IsString()
  @Length(1, 20)
  name: string

  @ApiProperty({ description: "낚시터 설명" })
  @IsString()
  description: string
}
