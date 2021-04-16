import { outMessage, topicFilter } from '../mqtt'
import { debounceTime, distinctUntilKeyChanged, filter, map, mergeMap, multicast, scan, tap } from 'rxjs/operators'
import { merge, of, Subject } from 'rxjs'
import { BinarySensorConfig, SwitchConfig as HaSwitchConfig } from '../mqtthomeAssistant'
import { handleSwitchAction, InitialState, SwitchAction, SwitchState } from './switchState'
import { DigitalValue, EDGE_BOTH, MODE_PULLUP } from 'mraa'
import { AvailableState, UnavailableState } from '../availabilty'
import { DeviceContext } from './devices'
import { loggerToTap } from '../logging/tapLogger'

export type SwitchConfig = {
  id: string,
  type: 'switch'
  io: {
    switchOutPin: number,
    switchInPin: number,
    availabilityPin: number
  }
}

// Constants

const OnState = 'ON'
const OffState = 'OFF'

const ReadSensorPeriod = 1000

export const createSwitch = (config: SwitchConfig, {mqtt, mraa, logger}: DeviceContext) => {

  const id = config.id
  const switchId = `${id}/switch`
  const sensorId = `${id}/water_sensor`

  const switchSetTopic = `devices/${switchId}/set`
  const switchStateTopic = `devices/${switchId}/state`
  const switchAvailabilityTopic = `devices/${switchId}/availability`

  const sensorStateTopic = `devices/${sensorId}/state`

  const loggerTap = loggerToTap(logger)

  mqtt.connectObservable
    .pipe(tap(client => client.subscribe(switchSetTopic)))
    .subscribe()

  const mqttObservable = mqtt.observable
  const mqttSubscriber = mqtt.subscriber({retain: true})

  const pumpSubscriber = mraa.setGpioAsOut(config.io.switchOutPin)
  const switchInStates = mraa.listenGpioChanges(config.io.switchInPin, EDGE_BOTH, MODE_PULLUP)
  const waterSensorStates = mraa.readInterval(config.io.availabilityPin, ReadSensorPeriod, MODE_PULLUP)

  const setActions = mqttObservable
    .pipe(
      topicFilter(switchSetTopic),
      map(({message}): SwitchAction => ({type: 'set', isOn: message.toString() === OnState})),
    )

  const toggleActions = switchInStates
    .pipe(
      debounceTime(ReadSensorPeriod),
      filter(value => value === 0),
      map((): SwitchAction => ({type: 'toggle'})),
    )

  const isSensingWater = (value: DigitalValue):boolean => value === 0

  const availabilityActions = waterSensorStates
    .pipe(
      map(isSensingWater),
      map((hasWater): SwitchAction => ({type: 'availability', isAvailable: hasWater}))
    )

  const reconnectTickActions = mqtt.reconnectObservable
    .pipe(map((): SwitchAction => ({type: 'tick'})))

  const states = merge(setActions, toggleActions, availabilityActions, reconnectTickActions)
    .pipe(
      loggerTap('Action'),
      scan(handleSwitchAction, InitialState),
      loggerTap('State'),
      multicast(() => new Subject<SwitchState>()),
    )

  states
    .pipe(
      map(state => outMessage(switchStateTopic, state.isOn ? OnState : OffState)),
      distinctUntilKeyChanged('message'),
    )
    .subscribe(mqttSubscriber)

  states
    .pipe(
      map(state => outMessage(switchAvailabilityTopic, state.isAvailable ? AvailableState : UnavailableState)),
      distinctUntilKeyChanged('message'),
    )
    .subscribe(mqttSubscriber)

  states
    .pipe(
      map(state => outMessage(sensorStateTopic, state.isAvailable ? OnState : OffState)),
      distinctUntilKeyChanged('message'),
    )
    .subscribe(mqttSubscriber)

  states
    .pipe(map(state => state.isAvailable && state.isOn ? 0 : 1))
    .subscribe(pumpSubscriber)

  // @ts-ignore
  states.connect()

  // Discovery

  const switchHaTopic = `homeassistant/switch/${id}/config`
  const switchHaConfig: HaSwitchConfig = {
    name: 'Sprinkler',
    unique_id: switchId,
    command_topic: switchSetTopic,
    state_topic: switchStateTopic,
    icon: 'hass:sprinkler',
    state_on: OnState,
    state_off: OffState,
    availability_mode: 'all',
    availability: [
      mqtt.availabilityConfig,
      {
        topic: switchAvailabilityTopic,
        payload_available: AvailableState,
        payload_not_available: UnavailableState,
      },
    ],
  }
  const sensorHaTopic = `homeassistant/binary_sensor/${id}/config`
  const sensorHaConfig: BinarySensorConfig = {
    name: 'Sprinkler has water',
    unique_id: sensorId,
    state_topic: sensorStateTopic,
    device_class: 'moisture',
    availability: [mqtt.availabilityConfig],
  }

  merge(mqtt.connectObservable, mqtt.reconnectObservable)
    .pipe(
      mergeMap(() => of(
        outMessage(switchHaTopic, JSON.stringify(switchHaConfig)),
        outMessage(sensorHaTopic, JSON.stringify(sensorHaConfig)),
      )),
    )
    .subscribe(mqttSubscriber)
}