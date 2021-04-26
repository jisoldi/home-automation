import { Mqtt } from '../../mqtt/mqtt'
import { OnOffState } from '../../common/onOffState'
import { Observer, Subscription } from 'rxjs'
import { AvailabilityState } from '../../common/availabilty'
import { createMqttObserver } from '../../mqtt/mqttObserver'

export type HassBinarySensor = {
  stateTopic: string,
  availabilityTopic: string,

  stateObserver: Observer<OnOffState>
  availabilityObserver: Observer<AvailabilityState>

  subscription: Subscription
}

export const createHassBinarySensor = (mqtt: Mqtt, baseTopic: string): HassBinarySensor => {
  const stateObserver = createMqttObserver<OnOffState>(mqtt, `${baseTopic}/state`)
  const availabilityObserver = createMqttObserver<AvailabilityState>(mqtt, `${baseTopic}/availability`)

  const subscription = stateObserver.subscription
    .add(availabilityObserver.subscription)

  return {
    stateTopic: stateObserver.topic,
    availabilityTopic: availabilityObserver.topic,

    stateObserver: stateObserver.observer,
    availabilityObserver: availabilityObserver.observer,

    subscription,
  }
}