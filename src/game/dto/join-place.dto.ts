import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class JoinPlaceDto {
  @ApiProperty({
    description: "들어갈 낚시터의 ID",
  })
  @IsString()
  placeId: string
}
