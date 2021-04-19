import { AvailabilityConfig, SwitchConfig } from '../../hass/mqtthomeAssistant'
import { OffState, OnState } from '../../common/onOffState'
import { HassSwitch } from './hassSwitch'
import { merge, SubscriptionLike } from 'rxjs'
import { AvailableState, UnavailableState } from '../../common/availabilty'
import { Mqtt, outMessage } from '../../mqtt/mqtt'
import { map } from 'rxjs/operators'

export type SwitchDiscoveryMetadata = {
  name: string,
  icon: string,
  deviceId: string,
  switchId: string
}

export const createHassSwitchDiscoveryConfig = (
  name: string,
  icon: string,
  switchId: string,
  setTopic: string,
  stateTopic: string,
  availability: AvailabilityConfig[],
): SwitchConfig =>
  ({
    name: name,
    unique_id: switchId,
    command_topic: setTopic,
    state_topic: stateTopic,
    icon: icon,
    state_on: OnState,
    state_off: OffState,
    availability_mode: 'all',
    availability: availability,
  })

export const createHassMqttSwitchDiscovery = (mqtt: Mqtt, hassSwitch: HassSwitch, metadata: SwitchDiscoveryMetadata): SubscriptionLike => {
  const {name, icon, deviceId, switchId} = metadata

  const topic = `homeassistant/switch/${deviceId}/config`
  const config: SwitchConfig = createHassSwitchDiscoveryConfig(
    name,
    icon,
    switchId,
    hassSwitch.setTopic,
    hassSwitch.stateTopic,
    [
      mqtt.availabilityConfig,
      {
        topic: hassSwitch.availabilityTopic,
        payload_available: AvailableState,
        payload_not_available: UnavailableState,
      },
    ],
  )

  return merge(mqtt.connectObservable, mqtt.reconnectObservable)
    .pipe(map(() => outMessage(topic, JSON.stringify(config))))
    .subscribe(mqtt.observer({retain: true}))
}