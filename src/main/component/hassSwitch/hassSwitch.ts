import { Mqtt } from '../../mqtt/mqtt'
import { Observable } from 'rxjs/internal/Observable'
import { OffState, OnOffState, OnState } from '../../common/onOffState'
import { Observer, Subscription } from 'rxjs'
import { AvailabilityState } from '../../common/availabilty'
import { createHassBinarySensor } from '../hassBinarySensor/hassBinarySensor'
import { createMqttObservable, StateGuard } from '../../mqtt/mqttObservable'

export type HassSwitch = {
  setTopic: string,
  stateTopic: string,
  availabilityTopic: string,

  setObservable: Observable<OnOffState>
  stateObserver: Observer<OnOffState>
  availabilityObserver: Observer<AvailabilityState>

  subscription: Subscription
}

const onOffStateGuard: StateGuard<OnOffState> = (message): message is OnOffState => message === OnState || message === OffState

export const createHassSwitch = (mqtt: Mqtt, baseTopic: string): HassSwitch => {

  const sensor = createHassBinarySensor(mqtt, baseTopic)
  const setObservable = createMqttObservable<OnOffState>(mqtt, `${baseTopic}/set`, onOffStateGuard)

  const subscription = setObservable.subscription
    .add(sensor.subscription)

  return {
    setTopic: setObservable.topic,
    stateTopic: sensor.stateTopic,
    availabilityTopic: sensor.availabilityTopic,

    setObservable: setObservable.observable,
    stateObserver: sensor.stateObserver,
    availabilityObserver: sensor.availabilityObserver,

    subscription,
  }
}