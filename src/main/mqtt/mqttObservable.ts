import { Mqtt, outMessage, topicFilter } from './mqtt'
import { Observer, Subject, Subscription } from 'rxjs'
import { distinctUntilChanged, filter, map, multicast, tap } from 'rxjs/operators'
import { AvailabilityState } from '../common/availabilty'
import { Observable } from 'rxjs/internal/Observable'

export type MqttObservable<S extends string> = {
  topic: string,
  observable: Observable<S>,
  subscription: Subscription,
}

export type StateGuard<S extends string> = (state: string) => state is S

export const createMqttObservable = <S extends string>(
  mqtt: Mqtt,
  topic: string,
  stateGuard: StateGuard<S>): MqttObservable<S> => {

  const subject = new Subject<S>()

  mqtt.connectObservable
    .pipe(tap(client => client.subscribe(topic)))
    .subscribe()

  const subscription = mqtt.observable.pipe(
    topicFilter(topic),
    map(({message}) => message.toString()),
    filter(stateGuard),
  ).subscribe(subject)

  const topicSubscription = new Subscription(() => mqtt.client.unsubscribe(topic))

  return {
    observable: subject.asObservable(),
    subscription: subscription.add(topicSubscription),
    topic,
  }
}