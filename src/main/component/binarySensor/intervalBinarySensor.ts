import { Mraa } from '../../gpio/mraa'
import { InGpioInfo } from '../../gpio/gpioInfo'
import { BinarySensor} from './binarySensor'
import { Observable } from 'rxjs'
import { distinctUntilChanged, map } from 'rxjs/operators'
import { BinaryState } from '../../common/binaryState'
import { DigitalValue } from '../../gpio/digitalValue'

export class IntervalBinarySensor<A, B> implements BinarySensor<A, B> {
  private readonly observable: Observable<BinaryState<A, B>>

  constructor(
    private readonly mraa: Mraa,
    { pin }: InGpioInfo,
    period: number,
    stateMapper: (value: DigitalValue) => BinaryState<A, B>,
  ) {
    this.observable = mraa.readInterval(pin, period)
      .pipe(
        distinctUntilChanged(),
        map(stateMapper)
      )
  }

  observe(): Observable<BinaryState<A, B>> { return this.observable }
}