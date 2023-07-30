import { ApiProperty } from "@nestjs/swagger"
import { Season } from "../../types"

export class PlaceDto {
  @ApiProperty({ description: "낚시터의 ID" })
  id: string

  @ApiProperty({ description: "낚시터의 이름" })
  name: string

  @ApiProperty({ description: "낚시터의 설명" })
  description: string

  @ApiProperty({ description: "낚시터의 청결도" })
  cleans: number

  @ApiProperty({ description: "낚시터의 경험치" })
  exp: number

  @ApiProperty({ description: "낚시터의 땅값" })
  capital: number

  @ApiProperty({ description: "낚시터의 수수료" })
  fee: number

  @ApiProperty({ description: "낚시터의 계절" })
  season: Season
}
