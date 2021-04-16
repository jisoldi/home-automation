import { DeviceConfig } from './device/devices'

export type Config = {
  node: {
    id: string
    mqtt: {
      brokerUrl: string,
      username?: string,
      password?: string,
    },
    log?: boolean
  }
  devices: DeviceConfig[]
}