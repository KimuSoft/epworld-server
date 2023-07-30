export const randomPercentage = (percentage: number) => {
  return Math.random() < percentage
}

export interface pmfObject {
  object: any
  frequency: number
}

export interface ExtendedPmfObject extends pmfObject {
  accumulate: number
  percentage: number
  frequencySum: number
}

export function pmfChoice(pmfObjects: pmfObject[]): pmfObject {
  const extPmfObjects = pmfAnalyze(pmfObjects)
  const random = Math.random() * extPmfObjects[0].frequencySum
  for (const obj of extPmfObjects) {
    if (random <= obj.accumulate) return obj
  }
  return extPmfObjects[0]
}

export function pmfAnalyze(pmfObjects: pmfObject[]): ExtendedPmfObject[] {
  let frequencySum = 0
  for (const obj of pmfObjects) {
    frequencySum += obj.frequency
    ;(obj as ExtendedPmfObject).accumulate = frequencySum
  }

  for (const obj of pmfObjects) {
    ;(obj as ExtendedPmfObject).frequencySum = frequencySum
    ;(obj as ExtendedPmfObject).percentage = obj.frequency / frequencySum
  }
  return pmfObjects as ExtendedPmfObject[]
}
