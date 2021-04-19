import { Mqtt, outMessage } from './mqtt'
import { Observer, Subject, Subscription } from 'rxjs'
import { distinctUntilChanged, map } from 'rxjs/operators'
import { AvailabilityState } from '../common/availabilty'

export type MqttObserver<S extends string> = {
  topic: string,
  observer: Observer<S>,
  subscription: Subscription,
}

export const createMqttObserver = <S extends string>(mqtt: Mqtt, topic: string): MqttObserver<S> => {
  const subject = new Subject<S>()

  const subscription = subject.pipe(
    distinctUntilChanged(),
    map(state => outMessage(topic, state)),
  )
    .subscribe(mqtt.observer({retain: true}))

  return {
    observer: subject,
    subscription,
    topic
  }
}