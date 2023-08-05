import { sample } from "lodash"
import { pmfChoice, pmfObject } from "../utils/random"
import fakeTexts from "./scripts/fakeTexts"
import normalTexts from "./scripts/normalTexts"
import timingTexts from "./scripts/timingTexts"
import { Rarity } from "../types"
// eslint-disable-next-line @typescript-eslint/no-var-requires
const randomNormal = require("random-normal")

export class GameEntity {
  id: string
  placeId: string
  userId: string

  turnCount: number
  state: GameState
  fishRarity: Rarity | null

  constructor(option: GameOption) {
    this.placeId = option.placeId
    this.userId = option.userId

    this.id = option.id || Math.random().toString()
    this.turnCount = option.turnCount ?? 0
    this.state = option.state ?? GameState.Idle
    this.fishRarity = option.fishRarity ?? null
  }

  async start() {
    if (this.state !== GameState.Idle) throw new InvalidStateError()

    this.state = GameState.NotTiming
  }

  async catchFish(): Promise<GameResult> {
    if (![GameState.NotTiming, GameState.Timing].includes(this.state))
      throw new InvalidStateError()

    const isSuccess = this.state === GameState.Timing
    this.state = GameState.End

    return {
      isSuccess,
      fishRarity: this.fishRarity,
      turnCount: this.turnCount,
    }
  }

  async end() {
    if ([GameState.End, GameState.Idle].includes(this.state))
      throw new InvalidStateError()

    this.state = GameState.End
  }

  async continue() {
    if (this.state !== GameState.WaitingForContinue)
      throw new InvalidStateError()

    this.state = GameState.NotTiming
    return this.progress()
  }

  async progress() {
    if (this.state === GameState.End) return null
    if (![GameState.NotTiming, GameState.Timing].includes(this.state))
      throw new InvalidStateError()

    this.turnCount++

    // 10턴에 한 번씩 계속 할 것인지 물어봄
    if (!(this.turnCount % 10)) {
      this.state = GameState.WaitingForContinue
      return {
        turnType: TurnType.Continue,
        text: "",
        time: 10000,
        effectStrength: 0,
      }
    }

    const turnType = pmfChoice(timingPmf)

    let text: string
    let time: number
    // 0부터 이펙트의 강도를 정함
    // 0: 이펙트 없음 (일반적으로 낚이지 않는 경우)
    // 1: 약한 이펙트
    // 2: 중간 이펙트 ( 보통 평범한 물고기 )
    // 3: 강한 이펙트 ( 보통 희귀한 물고기 )
    // 4: 매우 강한 이펙트 ( 보통 전설 이상 물고기 )
    let effectStrength: number

    this.state = GameState.NotTiming

    switch (turnType.object) {
      case TurnType.Normal:
        text = sample(normalTexts)
        time = Math.round(3000 * randomNormal({ mean: 1, dev: 0.3 }))
        effectStrength = Math.round(randomNormal({ mean: 0, dev: 1 }))
        this.fishRarity = null
        break
      case TurnType.Fake:
        text = sample(fakeTexts)
        time = Math.round(1200 * randomNormal({ mean: 1, dev: 0.2 }))
        effectStrength = Math.round(randomNormal({ mean: 2, dev: 2 }))
        this.fishRarity = null
        break
      case TurnType.Timing:
        text = sample(timingTexts)
        time = Math.round(800 * randomNormal({ mean: 1, dev: 0.2 }))
        effectStrength = Math.round(randomNormal({ mean: 3, dev: 1 }))
        this.fishRarity = pmfChoice(rarityPmf).object
        this.state = GameState.Timing
        break
    }

    return {
      text,
      time,
      effectStrength,
    }
  }

  toJSON() {
    return {
      id: this.id,
      turnCount: this.turnCount,
      state: this.state,
      fishRarity: this.fishRarity,
      placeId: this.placeId,
    }
  }
}

export class InvalidStateError extends Error {
  constructor() {
    super("잘못된 상태입니다.")
  }
}

export interface GameResult {
  isSuccess: boolean
  fishRarity: Rarity | null
  turnCount: number
}

export interface GameOption {
  id?: string
  userId: string
  placeId: string
  turnCount?: number
  state?: GameState
  fishRarity?: Rarity | null
}

export enum GameState {
  Idle,
  NotTiming,
  Timing,
  WaitingForContinue,
  End,
}

export enum TurnType {
  Normal,
  Fake,
  Timing,
  Continue,
}

const timingPmf: pmfObject<TurnType>[] = [
  { object: TurnType.Normal, frequency: 75 },
  { object: TurnType.Fake, frequency: 5 },
  { object: TurnType.Timing, frequency: 20 },
]

const rarityPmf: pmfObject<Rarity>[] = [
  { object: Rarity.Common, frequency: 65 },
  { object: Rarity.Rare, frequency: 20 },
  { object: Rarity.Epic, frequency: 15 },
  { object: Rarity.Legendary, frequency: 4.5 },
  { object: Rarity.Mythical, frequency: 0.5 },
]
