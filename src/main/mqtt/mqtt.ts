import { Client, ClientPublishOptions } from 'mqtt'
import { Observable, Observer, Subject, Subscriber } from 'rxjs'
import { filter } from 'rxjs/operators'
import { AvailabilityConfig } from '../hass/mqtthomeAssistant'

export type MqttInMessage = {
  topic: string
  message: Buffer
}

export type MqttOutMessage = {
  topic: string
  message: Buffer | string
}

export const outMessage = (topic: string, message: Buffer | string): MqttOutMessage => ({topic, message})

export const createMqttConnectObservable = (client: Client, type: 'connect' | 'reconnect' = 'connect'): Observable<Client> => {
  const subject = new Subject<Client>()
  client.on(type, () => subject.next(client))
  return subject.asObservable()
}

export const createMqttObservable = (client: Client): Observable<MqttInMessage> => {
  const subject = new Subject<MqttInMessage>()
  client.on('message', (topic, message) => subject.next({topic, message}))
  return subject.asObservable()
}

export const genericPublish = (client: Client, topic: string, message: string | Buffer, options?: ClientPublishOptions): Client => {
  return typeof message === 'string' ? client.publish(topic, message, options) : client.publish(topic, message, options)
}

export const createMqttObserver = (client: Client, options?: ClientPublishOptions): Observer<MqttOutMessage> =>
  new Subscriber<MqttOutMessage>(({topic, message}) => genericPublish(client, topic, message, options))

export const topicFilter = (expected: string) => filter(({topic}: MqttInMessage) => topic === expected)

export class Mqtt {
  constructor(readonly client: Client, readonly availabilityConfig: AvailabilityConfig) {}

  observable: Observable<MqttInMessage> = createMqttObservable(this.client)

  connectObservable: Observable<Client> = createMqttConnectObservable(this.client)

  reconnectObservable: Observable<Client> = createMqttConnectObservable(this.client, 'reconnect')

  observer(options?: ClientPublishOptions): Observer<MqttOutMessage> {return createMqttObserver(this.client, options)}
}