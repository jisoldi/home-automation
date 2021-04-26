import { Mraa } from '../../gpio/mraa'
import { BinarySensor } from '../binarySensor/binarySensor'
import { DigitalValue, isOne } from '../../gpio/digitalValue'
import { IntervalBinarySensor } from '../binarySensor/intervalBinarySensor'
import { inGpioInfo } from '../../gpio/gpioInfo'
import { BinaryState, createSimpleBinaryStateGuard } from '../../common/binaryState'

export const Moist = 'moist' as const
export const Dry = 'dry' as const

export type MoistureState = BinaryState<typeof Moist, typeof Dry>

export const isMoist = createSimpleBinaryStateGuard<typeof Moist, typeof Dry>(Moist)

export type  BinaryMoistureSensor = BinarySensor<typeof Moist, typeof Dry>

export const DefaultInterval = 1000 // milliseconds

const mapToMoistureState = (value: DigitalValue): MoistureState => isOne(value) ? Dry : Moist

export const createIntervalMoistureSensor = (mraa: Mraa, pin: number, interval = DefaultInterval): BinaryMoistureSensor =>
  new IntervalBinarySensor(mraa, inGpioInfo(pin), interval, mapToMoistureState)
