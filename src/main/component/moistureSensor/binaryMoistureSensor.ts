import { Mraa } from '../../gpio/mraa'
import { BinarySensor } from '../binarySensor/binarySensor'
import { DigitalValue, isOne } from '../../gpio/digitalValue'
import { IntervalBinarySensor } from '../binarySensor/intervalBinarySensor'
import { inGpioInfo } from '../../gpio/gpioInfo'
import { BinaryState, createSimpleBinaryStateGuard, createSimpleBinaryStateNot } from '../../common/binaryState'
import { HysteresisBinarySensor } from '../binarySensor/hysteresisBinarySensor'

export const Moist = 'moist' as const
export const Dry = 'dry' as const

export type MoistureState = BinaryState<typeof Moist, typeof Dry>

export const isMoist = createSimpleBinaryStateGuard<typeof Moist, typeof Dry>(Moist)

export const not = createSimpleBinaryStateNot<typeof Moist, typeof Dry>(Moist, Dry)

export type  BinaryMoistureSensor = BinarySensor<typeof Moist, typeof Dry>

export const DefaultInterval = 1000 // milliseconds

const mapToMoistureState = (value: DigitalValue): MoistureState => isOne(value) ? Dry : Moist

export const createIntervalMoistureSensor = (mraa: Mraa, pin: number, interval = DefaultInterval): BinaryMoistureSensor =>
  new IntervalBinarySensor(mraa, inGpioInfo(pin), interval, mapToMoistureState)

export const createHysteresisMoistureSensor = (sensor1: BinaryMoistureSensor, sensor2: BinaryMoistureSensor): BinaryMoistureSensor =>
  new HysteresisBinarySensor(sensor1, sensor2, Dry, isMoist, not)
