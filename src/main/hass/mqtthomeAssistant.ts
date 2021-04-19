export type AvailabilityConfig = {
  topic: string
  payload_available: string
  payload_not_available: string
}

type DeviceWithAvailabilityTopic = {
  availability?: AvailabilityConfig[]
} | {
  availability_topic?: string
  payload_available?: string
  payload_not_available?: string
}

type DeviceWithAvailabilityMode = {
  availability_mode?: 'all' | 'any' | 'latest'
}

type DeviceWithAvailability = DeviceWithAvailabilityMode & DeviceWithAvailabilityTopic

export type BinarySensorDeviceClass =
  | 'battery'
  | 'battery_charging'
  | 'cold'
  | 'connectivity'
  | 'door'
  | 'garage_door'
  | 'gas'
  | 'light'
  | 'lock'
  | 'moisture'
  | 'motion'
  | 'occupancy'
  | 'opening'
  | 'plug'
  | 'power'
  | 'presence'
  | 'problem'
  | 'safety'
  | 'smoke'
  | 'sound'
  | 'vibration'
  | 'window'

type DeviceConfig = {
  name?: string
  retain?: boolean
  unique_id?: string
  state_topic?: string
  value_template?: string
  json_attributes_topic?: string
  json_attributes_template?: string
} & DeviceWithAvailability

type BinaryDeviceConfig = {
  payload_on?: string
  payload_off?: string
}

export type BinarySensorConfig = DeviceConfig & BinaryDeviceConfig &
  {
    off_delay?: number
    force_update?: boolean
    expire_after?: number
    device_class?: BinarySensorDeviceClass
  }

export type SwitchConfig = DeviceConfig & BinaryDeviceConfig & {
  icon?: string
  state_on?: string
  state_off?: string
  optimistic?: boolean
  command_topic?: string
}
