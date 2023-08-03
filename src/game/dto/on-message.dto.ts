import { ApiProperty } from "@nestjs/swagger"
import { UserDto } from "../../users/dto/user.dto"

export class OnMessageDto {
  @ApiProperty({
    description: "메시지 내용",
  })
  content: string

  @ApiProperty({
    description: "메시지를 보낸 유저 정보",
  })
  author: UserDto
}
