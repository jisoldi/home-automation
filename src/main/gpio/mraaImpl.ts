import { interval, Observable, Subscriber } from 'rxjs'
import { DIR_IN, DIR_OUT, EDGE_BOTH, Gpio } from 'mraa'
import mraa from 'mraa'
import { createGpioSubscriber, createIrsObservable, createSingleGpioReadObservable } from './mraaUtils'
import { map } from 'rxjs/operators'
import { Mraa } from './mraa'
import { DigitalValue } from './digitalValue'
import { Dir, Edge } from './mraaConstants'

export class MraaImpl implements Mraa {
  setGpioAsOut(pin: number): Subscriber<DigitalValue> {
    const gpio = new mraa.Gpio(pin)
    gpio.dir(DIR_OUT)

    return createGpioSubscriber(gpio)
  }

  listenGpioChanges(pin: number, edge: Edge = EDGE_BOTH): Observable<DigitalValue> {
    const gpio = MraaImpl.setPinAs(pin, DIR_IN)
    return createIrsObservable(gpio, edge)
  }

  readSingle(pin: number): Observable<DigitalValue> {
    return createSingleGpioReadObservable(new mraa.Gpio(pin))
  }

  readInterval(pin: number, period: number): Observable<DigitalValue> {
    const gpio = MraaImpl.setPinAs(pin, DIR_IN)

    return interval(period)
      .pipe(map(() => gpio.read()))
  }

  private static setPinAs(pin: number, dir: Dir): Gpio {
    const gpio = new mraa.Gpio(pin)
    gpio.dir(dir)

    return gpio
  }
}