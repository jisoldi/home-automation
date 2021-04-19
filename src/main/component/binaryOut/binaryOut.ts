import { Observer, Subject } from 'rxjs'
import { isOnState, OnOffState } from '../../common/onOffState'
import { Mraa } from '../../gpio/mraa'
import { map } from 'rxjs/operators'
import { DigitalValue, negate } from '../../gpio/digitalValue'


export const createBinaryOut = (mraa: Mraa, pin: number, onValue: DigitalValue): Observer<OnOffState> => {
  const offValue = negate(onValue)

  const subject = new Subject<OnOffState>()
  subject
    .pipe(map(state => isOnState(state) ? onValue : offValue))
    .subscribe(mraa.setGpioAsOut(pin))

  return subject
} 
