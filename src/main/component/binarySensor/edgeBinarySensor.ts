import { Mraa } from '../../gpio/mraa'
import { InGpioInfo } from '../../gpio/gpioInfo'
import { BinarySensor } from './binarySensor'
import { Observable } from 'rxjs'
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators'
import { BinaryState } from '../../common/binaryState'
import { Edge } from '../../gpio/mraaConstants'
import { DigitalValue } from '../../gpio/digitalValue'

const DebounceTime = 200

export class EdgeBinarySensor<A, B> implements BinarySensor<A, B> {
  private readonly observable: Observable<BinaryState<A, B>>

  constructor(
    private readonly mraa: Mraa,
    {pin, dir, mode}: InGpioInfo,
    stateMapper: (value: DigitalValue) => BinaryState<A, B>,
  ) {
    this.observable = mraa.listenGpioChanges(pin, Edge.Both, mode)
      .pipe(
        debounceTime(DebounceTime),
        distinctUntilChanged(),
        map(stateMapper),
      )
  }

  observe(): Observable<BinaryState<A, B>> { return this.observable }
}