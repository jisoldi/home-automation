import { Observable } from 'rxjs'
import { BinaryState } from '../../common/binaryState'

export interface BinarySensor<A, B> {
  observe(): Observable<BinaryState<A, B>>
}