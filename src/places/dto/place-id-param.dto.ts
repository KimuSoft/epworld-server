import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class PlaceIdParamDto {
  @ApiProperty({ description: "낚시터 ID" })
  @IsString()
  id: string
}
