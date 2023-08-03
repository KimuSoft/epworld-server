import { ApiProperty } from "@nestjs/swagger"

export class UserDto {
  // 계정 정보

  @ApiProperty({ description: "계정 ID" })
  id: string

  @ApiProperty({ description: "계정 이름" })
  username: string

  @ApiProperty({ description: "유저의 아바타 이미지 URL" })
  avatar: string

  @ApiProperty({ description: "관리자 여부" })
  admin: boolean

  // 게임 정보

  @ApiProperty({ description: "소지금" })
  money: number

  @ApiProperty({ description: "경험치" })
  exp: number

  @ApiProperty({ description: "최근 방문한 장소 ID" })
  recentPlaceId: string

  // 게임 정보 (응용 필드)

  @ApiProperty({ description: "레벨" })
  level: number

  // 게임 정보 (릴레이션)

  // @ApiProperty({ description: "보유 낚시터 목록" })
  // places?: string[]

  @ApiProperty({ description: "보유 낚시터 ID 목록" })
  placeIds: string[]

  // @ApiProperty({ description: "보유 아이템 목록" })
  // items?: string[]

  @ApiProperty({ description: "보유 아이템 ID 목록" })
  itemIds: string[]

  // 생성 및 업데이트 정보

  @ApiProperty({ description: "계정 생성일" })
  createdAt: Date

  @ApiProperty({ description: "계정 업데이트일" })
  updatedAt: Date
}
