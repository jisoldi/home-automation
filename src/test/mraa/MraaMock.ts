import { Observable } from 'rxjs/internal/Observable'
import { Mraa } from '../../main/gpio/mraa'
import { DigitalValue, Edge, Mode } from 'mraa'
import { Subscriber } from 'rxjs'

export class MraaMock implements Mraa {
  listenGpioChanges = jest.fn<Observable<DigitalValue>, [pin: number, edge?: Edge, mode?: Mode]>()

  readInterval = jest.fn<Observable<DigitalValue>, [pin: number, period: number, mode?: Mode]>()

  readSingle = jest.fn<Observable<DigitalValue>, [pin: number]>()

  setGpioAsOut = jest.fn<Subscriber<DigitalValue>, [pin: number]>()
}