import { MraaMock } from '../../mraa/MraaMock'
import { IntervalBinarySensor } from '../../../main/component/binarySensor/intervalBinarySensor'
import { OffState, OnOffState, OnState } from '../../../main/common/onOffState'
import { of } from 'rxjs'
import { toArray } from 'rxjs/operators'
import { DigitalValue, isOne } from '../../../main/gpio/digitalValue'
import { inGpioInfo } from '../../../main/gpio/gpioInfo'
import { OnOffSensor } from '../../../main/component/binarySensor/onOffSensor'

describe('IntervalBinarySensor', () => {
  const pin = 10
  const period = 1

  const createTest = (expectTitle: string, values: DigitalValue[], expected: OnOffState[]) => {
    let mraaMock: MraaMock
    let binarySensor: OnOffSensor
    let result: OnOffState[]

    beforeAll(async () => {
      mraaMock = new MraaMock()
      mraaMock.readInterval.mockReturnValue(of(...values))

      binarySensor = new IntervalBinarySensor(
        mraaMock,
        inGpioInfo(pin),
        period,
        value => isOne(value) ? OnState : OffState,
      )

      result = await new Promise(resolve =>
        binarySensor.observe().pipe(toArray()).subscribe(value => resolve(value)),
      )
    })

    it(expectTitle, () => expect(result).toEqual(expected))
  }

  describe('when a single 1 value is read', () => {
    createTest('should return a single on', [1], [OnState])
  })

  describe('when a single 0 value is read', () => {
    createTest('should return a single off', [0], [OffState])
  })

  describe('when several 1 value are read', () => {
    createTest('should return a single on', [1, 1, 1], [OnState])
  })

  describe('when several 0 value is read', () => {
    createTest('should return a single off', [0, 0, 0], [OffState])
  })

  describe('when mix values are read stating with one', () => {
    createTest(
      'should return several values',
      [1, 0, 1],
      [OnState, OffState, OnState],
    )
  })

  describe('when mix values are read stating with zero', () => {
    createTest(
      'should return several values',
      [0, 1, 0],
      [OffState, OnState, OffState],
    )
  })

  describe('when several mix values are read', () => {
    createTest(
      'should return several values',
      [1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0],
      [OnState, OffState, OnState, OffState, OnState, OffState],
    )
  })

})