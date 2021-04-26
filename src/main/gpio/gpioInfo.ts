import { Dir, Mode } from './mraaConstants'

export type GpioInfoCommon = {
  pin: number
}

export type InGpioInfo = GpioInfoCommon & {
  dir: Dir.In
}

export const inGpioInfo = (pin: number): InGpioInfo => ({dir: Dir.In, pin})

export type OutGpioInfo = GpioInfoCommon & {
  dir: Dir.Out
  mode?: Mode
}

export const outGpioInfo = (pin: number, mode?: Mode): OutGpioInfo => ({dir: Dir.Out, pin})

export type GpioInfo =
  | InGpioInfo
  | OutGpioInfo
