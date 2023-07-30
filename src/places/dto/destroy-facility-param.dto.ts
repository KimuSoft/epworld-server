import { ApiProperty } from "@nestjs/swagger"
import { PlaceIdParamDto } from "./place-id-param.dto"
import { IsString } from "class-validator"

export class DestroyFacilityParamDto extends PlaceIdParamDto {
  @ApiProperty({ description: "철거할 시설 ID" })
  @IsString()
  facilityId: string
}
