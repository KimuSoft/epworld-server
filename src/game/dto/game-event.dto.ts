import { ApiProperty } from "@nestjs/swagger"

export class GameEventDto {
  @ApiProperty({
    description: "게임 이벤트가 발생한 턴",
  })
  turn: number

  @ApiProperty({
    description:
      "이벤트 메시지. 게임 생성 시 언어 설정에 따라 다른 메시지가 출력된다.",
  })
  text: string

  @ApiProperty({
    description:
      "이벤트의 이펙트 강도(0 ~ 5). 높을 수록 희귀한 물고기가 낚이기 쉽다.",
  })
  effectStrength: number
}
