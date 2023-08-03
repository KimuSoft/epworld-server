import { ApiProperty } from "@nestjs/swagger"

export class ItemDto {
  @ApiProperty({ description: "아이템 인스턴스 ID" })
  id: string

  @ApiProperty({ description: "아이템 종류 ID" })
  itemId: string

  @ApiProperty({ description: "아이템 주인 ID" })
  ownerId: string

  // 날짜 정보

  @ApiProperty({ description: "아이템 생성일" })
  createdAt: Date

  @ApiProperty({ description: "아이템 업데이트일" })
  updatedAt: Date

  @ApiProperty({ description: "아이템 삭제일" })
  deletedAt: Date | null
}
