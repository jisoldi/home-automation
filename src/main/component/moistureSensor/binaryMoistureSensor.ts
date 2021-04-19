import { Mraa } from '../../gpio/mraa'
import { BinarySensor } from '../binarySensor/binarySensor'
import { DigitalValue, isOne } from '../../gpio/digitalValue'
import { IntervalBinarySensor } from '../binarySensor/intervalBinarySensor'
import { inGpioInfo } from '../../gpio/gpioInfo'
import { Mode } from '../../gpio/mraaConstants'

export const Moist = 'Moist' as const
export const Dry = 'Dry' as const

export type MoistureState = typeof Moist | typeof Dry

export const isMoist = (value: MoistureState): value is typeof Moist => value === Moist

export const isDry = (value: MoistureState): value is typeof Dry => value === Dry

export type  BinaryMoistureSensor = BinarySensor<typeof Moist, typeof Dry>

export const DefaultInterval = 1000 // milliseconds

const mapToMoistureState = (value: DigitalValue): MoistureState => isOne(value) ? Moist : Dry

export const createIntervalMoistureSensor = (mraa: Mraa, pin: number, interval = DefaultInterval): BinaryMoistureSensor =>
  new IntervalBinarySensor(mraa, inGpioInfo(pin, Mode.PullUp), interval, mapToMoistureState)
