import { DigitalValue, Edge, Gpio } from 'mraa'
import { Observable, of, Subject, Subscriber } from 'rxjs'

export const createGpioSubscriber = (gpio: Gpio): Subscriber<DigitalValue> =>
  new Subscriber(gpio.write.bind(gpio))

export const createIrsObservable = (gpio: Gpio, mode: Edge): Observable<DigitalValue> => {
  const subject = new Subject<DigitalValue>()
  gpio.isr(mode, () => subject.next(gpio.read()))
  return subject.asObservable()
}

export const createSingleGpioReadObservable = (gpio: Gpio): Observable<DigitalValue> => of(gpio.read())