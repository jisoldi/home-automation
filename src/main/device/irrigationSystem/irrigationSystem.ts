import { map, scan } from 'rxjs/operators'
import { merge, Subject } from 'rxjs'
import {
  handleIrrigationAction,
  InitialState,
  setAvailabilityAction,
  setStateAction,
  State,
  TickAction,
  ToggleStateAction,
} from './state'
import { isAvailable } from '../../common/availabilty'
import { DeviceContext } from '../devices'
import { loggerToTap } from '../../logging/tapLogger'
import {
  createHysteresisMoistureSensor,
  createIntervalMoistureSensor,
  isMoist,
} from '../../component/moistureSensor/binaryMoistureSensor'
import { createHassMqttSwitchDiscovery } from '../../component/hassSwitch/hassSwitchDiscovery'
import { createHassSwitch } from '../../component/hassSwitch/hassSwitch'
import { isOnState, OffState, OnState } from '../../common/onOffState'
import { createOnOffEdgeSensor } from '../../component/binarySensor/onOffSensor'
import { inGpioInfo } from '../../gpio/gpioInfo'
import { createHassBinarySensor } from '../../component/hassBinarySensor/hassBinarySensor'
import { createHassBinarySensorDiscovery } from '../../component/hassBinarySensor/hassSwitchDiscovery'
import { createBinaryOut } from '../../component/binaryOut/binaryOut'
import { ZeroValue } from '../../gpio/digitalValue'

export type IrrigationSystemConfig = {
  type: 'irrigation-system'
  id: string
  io: {
    switchOutPin: number
    switchInPin: number
    availabilityPin1: number
    availabilityPin2: number
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

  const moistureSensor1 = createIntervalMoistureSensor(mraa, config.io.availabilityPin1)
  const moistureSensor2 = createIntervalMoistureSensor(mraa, config.io.availabilityPin2)
  const moistureSensor = createHysteresisMoistureSensor(moistureSensor1, moistureSensor2)
  const switchSensor = createOnOffEdgeSensor(mraa, inGpioInfo(config.io.switchInPin), ZeroValue)
  const hassSwitch = createHassSwitch(mqtt, switchBaseTopic)
  const hassSensor = createHassBinarySensor(mqtt, sensorBaseTopic)
  const pumpObserver = createBinaryOut(mraa, config.io.switchOutPin, 1)

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
    .pipe(map(state => state.pumpState))
    .subscribe(hassSwitch.stateObserver)

  states
    .pipe(map(state => state.availability))
    .subscribe(hassSwitch.availabilityObserver)

  states
    .pipe(map(state => isAvailable(state.availability) ? OnState : OffState))
    .subscribe(hassSensor.stateObserver)

  states
    .pipe(map(state => isAvailable(state.availability) ? state.pumpState : OffState))
    .subscribe(pumpObserver)

  // Discovery

  createHassMqttSwitchDiscovery(mqtt, hassSwitch, {
    name: Name,
    icon: 'hass:sprinkler',
    deviceId: id,
    switchId,
  })

  createHassBinarySensorDiscovery(mqtt, hassSensor, {
    name: `${Name}  reservoir`,
    deviceClass: 'moisture',
    deviceId: id,
    sensorId,
  })
}