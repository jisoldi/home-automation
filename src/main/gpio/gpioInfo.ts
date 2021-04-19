import { Dir, Mode } from './mraaConstants'

export type GpioInfoCommon = {
  pin: number
}

export type InGpioInfo = GpioInfoCommon & {
  dir: Dir.In
  mode?: Mode
}

export const inGpioInfo = (pin: number, mode?: Mode): InGpioInfo => ({dir: Dir.In, pin, mode})

export type OutGpioInfo = GpioInfoCommon & {
  dir: Dir.Out
}

export const outGpioInfo = (pin: number): OutGpioInfo => ({dir: Dir.Out, pin})

export type GpioInfo =
  | InGpioInfo
  | OutGpioInfo
