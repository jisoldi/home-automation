import { BinarySensor } from './binarySensor'
import { OffState, OffStateType, OnState, OnStateType } from '../../common/onOffState'
import { Mraa } from '../../gpio/mraa'
import { InGpioInfo } from '../../gpio/gpioInfo'
import { DigitalValue, OneValue } from '../../gpio/digitalValue'
import { EdgeBinarySensor } from './edgeBinarySensor'

export type OnOffSensor = BinarySensor<OnStateType, OffStateType>

export const createOnOffEdgeSensor = (mraa: Mraa, gpioInfo: InGpioInfo, onState: DigitalValue = OneValue): OnOffSensor =>
  new EdgeBinarySensor(mraa, gpioInfo, value => value === onState ? OnState : OffState)