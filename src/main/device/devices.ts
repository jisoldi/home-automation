import { createSwitch, SwitchConfig } from './switch'
import { Mqtt } from '../mqtt'
import { Mraa } from '../mraa'
import { Logger } from '../logging/logger'

export type DeviceConfig = SwitchConfig

export type DeviceContext = {
  logger: Logger
  mqtt: Mqtt
  mraa: Mraa
}

export const createDevice = (config: DeviceConfig, context: DeviceContext) => {
  createSwitch(config, context)
}