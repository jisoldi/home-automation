import { createIrrigationSystem, IrrigationSystemConfig } from './irrigationSystem/irrigationSystem'
import { Mqtt } from '../mqtt/mqtt'
import { Mraa } from '../gpio/mraa'
import { Logger } from '../logging/logger'

export type DeviceConfig = IrrigationSystemConfig

export type DeviceContext = {
  logger: Logger
  mqtt: Mqtt
  mraa: Mraa
}

export const createDevice = (config: DeviceConfig, context: DeviceContext) => {
  createIrrigationSystem(config, context)
}