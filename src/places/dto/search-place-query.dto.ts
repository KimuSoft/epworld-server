import { ApiProperty } from "@nestjs/swagger"
import { IsNumber } from "class-validator"

export class SearchPlaceQueryDto {
  @ApiProperty({
    description: "검색어",
    required: false,
    default: "",
  })
  q: string = ""

  @ApiProperty({
    description: "검색 시작 위치",
    required: false,
    default: 0,
  })
  @IsNumber()
  start?: number = 0

  @ApiProperty({
    description: "검색 결과 개수",
    required: false,
    default: 20,
  })
  @IsNumber()
  limit?: number = 20
}
