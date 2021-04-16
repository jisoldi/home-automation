import { Observable, of, Subject, Subscriber, interval } from 'rxjs'
import * as mraa from 'mraa'
import { DigitalValue, Dir, DIR_IN, DIR_OUT, Edge, EDGE_BOTH, Gpio, Mode } from 'mraa'
import { map } from 'rxjs/operators'

export const createGpioSubscriber = (gpio: Gpio): Subscriber<DigitalValue> =>
  new Subscriber(gpio.write.bind(gpio))

export const createIrsObservable = (gpio: Gpio, mode: Edge): Observable<DigitalValue> => {
  const subject = new Subject<DigitalValue>()
  gpio.isr(mode, () => subject.next(gpio.read()))
  return subject.asObservable()
}

export const createSingleGpioReadObservable = (gpio: Gpio): Observable<DigitalValue> => of(gpio.read())

export class Mraa {
  setGpioAsOut(pin: number): Subscriber<DigitalValue> {
    const gpio = new mraa.Gpio(pin)
    gpio.dir(DIR_OUT)

    return createGpioSubscriber(gpio)
  }

  listenGpioChanges(pin: number, edge: Edge = EDGE_BOTH, mode?: Mode): Observable<DigitalValue> {
    const gpio = Mraa.setPinAs(pin, DIR_IN, mode)
    return createIrsObservable(gpio, edge)
  }

  readSingle(pin: number): Observable<DigitalValue> {
    return createSingleGpioReadObservable(new mraa.Gpio(pin))
  }

  readInterval(pin: number, period: number, mode?: Mode): Observable<DigitalValue> {
    const gpio = Mraa.setPinAs(pin, DIR_IN, mode)

    return interval(period)
      .pipe(map(() => gpio.read()))
  }

  private static setPinAs(pin: number, dir: Dir, mode?: Mode): Gpio {
    const gpio = new mraa.Gpio(pin)
    gpio.dir(dir)
    mode !== undefined && gpio.mode(mode)

    return gpio
  }
}