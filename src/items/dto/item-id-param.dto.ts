import { ApiProperty } from "@nestjs/swagger"
import { IsUUID } from "class-validator"

export class ItemIdParamDto {
  @ApiProperty({
    description: "아이템 UUID",
  })
  @IsUUID()
  id: string
}
