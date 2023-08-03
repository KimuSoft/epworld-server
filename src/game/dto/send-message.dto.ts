import { ApiProperty } from "@nestjs/swagger"
import { IsString, Length } from "class-validator"

export class SendMessageDto {
  @ApiProperty({
    description: "메시지 내용",
  })
  @IsString()
  @Length(1, 999)
  content: string
}
