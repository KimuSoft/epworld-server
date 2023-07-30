import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsPositive } from "class-validator"

export class BuyPlaceDto {
  @ApiProperty({ description: "매입할 지분의 양" })
  @IsNumber()
  @IsPositive()
  amount: number
}
