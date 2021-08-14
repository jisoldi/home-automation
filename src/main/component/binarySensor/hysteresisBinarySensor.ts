import { BinarySensor } from './binarySensor'
import { combineLatest, Observable } from 'rxjs'
import { BinaryState, BinaryStateGuard, BinaryStateNot } from '../../common/binaryState'
import { scan } from 'rxjs/operators'

const createHysteresisBinaryReducer = <A, B>(isA: BinaryStateGuard<A, B, A>, not: BinaryStateNot<A, B>) =>
  (state: BinaryState<A, B>, sensorStates: [BinaryState<A, B>, BinaryState<A, B>]) => {
    const [sensor1, sensor2] = sensorStates

    if (isA(sensor1) && isA(sensor2)) return isA(state) ? state : not(state)
    if (!isA(sensor1) && !isA(sensor2)) return isA(state) ? not(state) : state

    return state
  }

export class HysteresisBinarySensor<A, B> implements BinarySensor<A, B> {
  private readonly observable: Observable<BinaryState<A, B>>

  constructor(
    sensor1: BinarySensor<A, B>,
    sensor2: BinarySensor<A, B>,
    initialState: BinaryState<A, B>,
    isA: BinaryStateGuard<A, B, A>,
    not: BinaryStateNot<A, B>,
  ) {
    const observable1 = sensor1.observe()
    const observable2 = sensor2.observe()

    this.observable = combineLatest(observable1, observable2).pipe(scan(createHysteresisBinaryReducer<A, B>(isA, not), initialState))
  }

  observe(): Observable<BinaryState<A, B>> {return this.observable}

}