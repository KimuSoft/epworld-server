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

  @ApiProperty({
    description: "이벤트의 종류입니다.",
  })
  eventType: GameEventType

  @ApiProperty({
    description:
      "답변을 기다리는 시간(초) 클라이언트에서 시간을 표시해주기 위해 사용되며, 일반 낚시 시에는 알려주지 않습니다.",
  })
  time?: number
}

export enum GameEventType {
  Normal,

  // 낚시를 계속할 지 묻는 이벤트
  Continue,

  // OX 질문 이벤트: 답은 'game:yes' 또는 'game:no'로 보내야 합니다.
  Question,

  // OX 질문 결과 이벤트
  QuestionResult,
}
