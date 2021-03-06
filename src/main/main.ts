import * as mqtt from 'mqtt'
import { createDevice, DeviceContext } from './device/devices'
import { Mqtt, MqttOutMessage } from './mqtt/mqtt'
import { Config } from './config'
import * as fs from 'fs'
import { AvailabilityConfig } from './hass/mqtthomeAssistant'
import { AvailableState, UnavailableState } from './common/availabilty'
import { map } from 'rxjs/operators'
import { merge } from 'rxjs'
import { ConsoleLogger } from './logging/consoleLogger'
import { DefaultDateProvider } from './common/date/defaultDateProvider'
import { nonUndefined } from './common/utils/undefined'
import { SilentLogger } from './logging/silentLogger'
import { MraaImpl } from './gpio/mraaImpl'
import * as mraa from 'mraa'
import { DIR_IN, DIR_OUT, MODE_PULLDOWN, MODE_PULLUP, MODE_STRONG } from 'mraa'

const args = process.argv.slice(2)

const configPath = args[0]
if (configPath === undefined)
  throw Error('Configuration path is missing')

const mainConfig: Config = JSON.parse(fs.readFileSync(configPath).toString())

const nodeAvailabilityTopic = `nodes/${mainConfig.node.id}/availability`

const availabilityConfig: AvailabilityConfig = {
  topic: nodeAvailabilityTopic,
  payload_available: AvailableState,
  payload_not_available: UnavailableState,
}

const mqttClient = mqtt.connect(mainConfig.node.mqtt.brokerUrl, {
  username: mainConfig.node.mqtt.username,
  password: mainConfig.node.mqtt.password,
  will: {
    topic: nodeAvailabilityTopic,
    payload: UnavailableState,
    retain: true,
    qos: 2,
  },
})

mqttClient.on('error', error => {
  // message is Buffer
  console.error(error)
  mqttClient.end()
})

const mqttWrapper = new Mqtt(mqttClient, availabilityConfig)

merge(mqttWrapper.connectObservable, mqttWrapper.reconnectObservable)
  .pipe(map((): MqttOutMessage => ({topic: nodeAvailabilityTopic, message: AvailableState})))
  .subscribe(mqttWrapper.observer({retain: true}))

const logger = nonUndefined(mainConfig.node.log, false) ?
  new ConsoleLogger(new DefaultDateProvider()) : new SilentLogger()

const context: DeviceContext = {
  mqtt: mqttWrapper,
  mraa: new MraaImpl(),
  logger,
}

const gpio = new mraa.Gpio(15)
console.log(gpio.read())

mainConfig.devices.forEach(device => createDevice(device, context))