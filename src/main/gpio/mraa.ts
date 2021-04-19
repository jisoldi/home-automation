import { Observable, Observer } from 'rxjs'
import { DigitalValue } from './digitalValue'
import { Edge, Mode } from './mraaConstants'

export interface Mraa {
  setGpioAsOut(pin: number): Observer<DigitalValue>

  listenGpioChanges(pin: number, edge?: Edge, mode?: Mode): Observable<DigitalValue>

  readSingle(pin: number): Observable<DigitalValue>

  readInterval(pin: number, period: number, mode?: Mode): Observable<DigitalValue>
}