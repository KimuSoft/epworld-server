// 시설 이름 및 설명 정보는 다국어 지원을 생각하여 클라이언트에서 담당합니다.

import { Biome } from "../../../types"
import { PlaceEntity } from "../../../places/place.entity"

export interface FacilityData {
  id: string
  name: string

  // 낚시터 건설에 필요한 명성
  cost: number

  // 낚시터 건설에 필요한 낚시터 레벨
  requiredLevel: number

  // 건설 불가능한 바이옴 (whiteListedBiomes가 우선)
  blackListedBiomes?: Biome[]

  // 건설 가능한 바이옴
  whiteListedBiomes?: Biome[]

  // 낚시터 건설 효과
  getEffect(placeContext?: PlaceEntity): FacilityEffect
}

// 곱계산 스탯은 어미에 rate를 붙여 표현합니다.
export interface FacilityEffect {
  // 수수료 설정 최솟값
  fee: number

  // 수수료 설정 범위 (ex: 수수료 설정 범위는 fee - feeRange / 2 ~ fee + feeRange / 2)
  feeRange: number

  // 낚이는 물고기의 길이 계수
  fishLengthRate: number

  // 명성 획득 계수
  fameRate: number

  // 낚시터 경험치 획득 계수
  expRate: number

  // 쓰레기 ~ 전설 물고기 등장 빈도 증가
  trashFrequency: number
  commonFishFrequency: number
  rareFishFrequency: number
  epicFishFrequency: number
  legendaryFishFrequency: number
  mythicFishFrequency: number

  // 턴당 물고기가 낚일 빈도
  fishFrequency: number

  // 턴당 낚시 빈도
  fakeFrequency: number

  // 쓰레기 투기 적발 시 벌금 %
  fineRate: number

  // 쓰레기 투기 시 적발될 확률
  fineFrequency: number
}
