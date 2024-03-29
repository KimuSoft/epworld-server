import { pmfChoice, pmfObject } from "./random"
import * as _ from "lodash"
// eslint-disable-next-line @typescript-eslint/no-var-requires
const randomNormal = require("random-normal")
// import randomNormal from "random-normal";

export enum TurnType {
  Normal,
  Fake,
  Timing,
}

interface Turn {
  text: string
  type: TurnType
  time: number
}

const timingPmf: pmfObject<TurnType>[] = [
  { object: TurnType.Normal, frequency: 75 },
  { object: TurnType.Fake, frequency: 5 },
  { object: TurnType.Timing, frequency: 20 },
]

export const getTurn = (): Turn => {
  const turnType = pmfChoice(timingPmf)

  let text: string
  let time: number
  switch (turnType.object) {
    case TurnType.Normal:
      text = _.sample(normalText)
      time = 3000 * randomNormal({ mean: 1, dev: 0.3 })
      break
    case TurnType.Fake:
      text = _.sample(fakeText)
      time = 1200 * randomNormal({ mean: 1, dev: 0.2 })
      break
    case TurnType.Timing:
      text = _.sample(timingText)
      time = 800 * randomNormal({ mean: 1, dev: 0.2 })
      break
  }

  return { text, type: turnType.object, time }
}

// TODO: 낚시 난이도(낚시대, 낚시터에 따라 결정)에 따라 텍스트가 달라지게 함
const normalText = [
  "언제 낚시찌를 물어주려나...",
  "날씨가 참 좋네...",
  "흐아암... 졸릴 거 같아",
  "물 소리가 기분 좋네...",
]
const fakeText = [
  "앗! 날씨가 너무 좋다!!!",
  "앗 낚시대에 느낌이 안 와!!!",
  "앗 찌에 느낌이 전혀 없어!!!",
  "언제 낚이냐구!!!",
]
const timingText = ["앗! 찌에 느낌이!!!", "앗 낚시대에 느낌이!!!"]
