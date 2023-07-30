import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsString, Length } from "class-validator"

export class UpdatePlaceDto {
  @ApiProperty({ description: "낚시터 이름" })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  name?: string

  @ApiProperty({ description: "낚시터 설명" })
  @IsOptional()
  @IsString()
  description?: string
}
