import { distinctUntilChanged, map, multicast, scan } from 'rxjs/operators'
import { merge, Subject } from 'rxjs'
import {
  setAvailabilityAction,
  handleIrrigationAction,
  InitialState,
  setStateAction,
  State,
  TickAction,
  ToggleStateAction,
} from './state'
import { AvailableState, UnavailableState } from '../../common/availabilty'
import { DeviceContext } from '../devices'
import { loggerToTap } from '../../logging/tapLogger'
import { createIntervalMoistureSensor, isMoist } from '../../component/moistureSensor/binaryMoistureSensor'
import { createHassMqttSwitchDiscovery } from '../../component/hassSwitch/hassSwitchDiscovery'
import { createHassSwitch } from '../../component/hassSwitch/hassSwitch'
import { isOnState, OffState, OnState } from '../../common/onOffState'
import { createOnOffEdgeSensor } from '../../component/binarySensor/onOffSensor'
import { inGpioInfo } from '../../gpio/gpioInfo'
import { Mode } from '../../gpio/mraaConstants'
import { createHassBinarySensor } from '../../component/hassBinarySensor/hassBinarySensor'
import { createHassBinarySensorDiscovery } from '../../component/hassBinarySensor/hassSwitchDiscovery'
import { createBinaryOut } from '../../component/binaryOut/binaryOut'

export type IrrigationSystemConfig = {
  type: 'irrigation-system'
  id: string
  io: {
    switchOutPin: number
    switchInPin: number
    availabilityPin: number
  }
}

const Name = 'Irrigation System'

export const createIrrigationSystem = (config: IrrigationSystemConfig, {mqtt, mraa, logger}: DeviceContext) => {

  const id = config.id
  const switchId = `${id}/switch`
  const sensorId = `${id}/water_sensor`

  const switchBaseTopic = `devices/${switchId}`
  const sensorBaseTopic = `devices/${sensorId}`

  const loggerTap = loggerToTap(logger)

  const moistureSensor = createIntervalMoistureSensor(mraa, config.io.availabilityPin)
  const switchSensor = createOnOffEdgeSensor(mraa, inGpioInfo(config.io.switchInPin), Mode.PullUp)
  const hassSwitch = createHassSwitch(mqtt, switchBaseTopic)
  const hassSensor = createHassBinarySensor(mqtt, sensorBaseTopic)
  const pumpObserver = createBinaryOut(mraa, config.io.switchOutPin, 0)

  const setStateActions = hassSwitch.setObservable
    .pipe(map(setState => setStateAction(isOnState(setState))))

  const toggleActions = switchSensor.observe()
    .pipe(map(() => ToggleStateAction))

  const setAvailabilityActions = moistureSensor.observe()
    .pipe(
      map(isMoist),
      map(hasWater => setAvailabilityAction(hasWater)),
    )

  const reconnectTickActions = mqtt.reconnectObservable
    .pipe(map(() => TickAction))

  const states = new Subject<State>()
  merge(setStateActions, toggleActions, setAvailabilityActions, reconnectTickActions)
    .pipe(
      loggerTap('Action'),
      scan(handleIrrigationAction, InitialState),
      loggerTap('State'),
    )
    .subscribe(states)

  states
    .pipe(map(state => state.isOn ? OnState : OffState),)
    .subscribe(hassSwitch.stateObserver)

  states
    .pipe(map(state => state.isAvailable ? AvailableState : UnavailableState),)
    .subscribe(hassSwitch.availabilityObserver)

  states
    .pipe(map(state => state.isAvailable ? OnState : OffState),)
    .subscribe(hassSensor.stateObserver)

  states
    .pipe(map(state => state.isAvailable && state.isOn ? OnState : OffState))
    .subscribe(pumpObserver)

  // Discovery

  createHassMqttSwitchDiscovery(mqtt, hassSwitch, {
    name: Name,
    icon: 'hass:sprinkler',
    deviceId: id,
    switchId,
  })

  createHassBinarySensorDiscovery(mqtt, hassSwitch, {
    name: `${Name}  reservoir`,
    deviceClass: 'moisture',
    deviceId: id,
    sensorId,
  })
}