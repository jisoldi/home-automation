import { AvailabilityConfig, BinarySensorConfig, BinarySensorDeviceClass } from '../../hass/mqtthomeAssistant'
import { HassBinarySensor } from './hassBinarySensor'
import { merge, SubscriptionLike } from 'rxjs'
import { Mqtt, outMessage } from '../../mqtt/mqtt'
import { map } from 'rxjs/operators'
import { OffState, OnState } from '../../common/onOffState'

export type BinarySensorDiscoveryMetadata = {
  name: string,
  deviceClass: BinarySensorDeviceClass,
  deviceId: string,
  sensorId: string
}

export const createHassBinarySensorDiscoveryConfig = (
  name: string,
  deviceClass: BinarySensorDeviceClass,
  sensorId: string,
  stateTopic: string,
  availability: AvailabilityConfig[],
): BinarySensorConfig =>
  ({
    name,
    unique_id: sensorId,
    state_topic: stateTopic,
    device_class: deviceClass,
    availability: availability,
    payload_on: OnState,
    payload_off: OffState,
  })

export const createHassBinarySensorDiscovery = (mqtt: Mqtt, binarySensor: HassBinarySensor, metadata: BinarySensorDiscoveryMetadata): SubscriptionLike => {
  const {name, deviceClass, deviceId, sensorId} = metadata

  const topic = `homeassistant/binary_sensor/${deviceId}/config`
  const config: BinarySensorConfig = createHassBinarySensorDiscoveryConfig(
    name,
    deviceClass,
    sensorId,
    binarySensor.stateTopic,
    [mqtt.availabilityConfig],
  )

  return merge(mqtt.connectObservable, mqtt.reconnectObservable)
    .pipe(map(() => outMessage(topic, JSON.stringify(config))))
    .subscribe(mqtt.observer({retain: true}))
}