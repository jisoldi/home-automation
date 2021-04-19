import { MraaMock } from '../../mraa/MraaMock'
import { IntervalBinarySensor } from '../../../main/component/binarySensor/intervalBinarySensor'
import { OffState, OnOffState, OnState } from '../../../main/common/onOffState'
import { of } from 'rxjs'
import { toArray } from 'rxjs/operators'
import { DigitalValue, isOne } from '../../../main/gpio/digitalValue'
import {
  BinaryMoistureSensor,
  createIntervalMoistureSensor, Dry, isDry, isMoist, Moist,
  MoistureState,
} from '../../../main/component/moistureSensor/binaryMoistureSensor'
import { OnOffSensor } from '../../../main/component/binarySensor/onOffSensor'

describe('BinaryMoistureSensor', () => {
  describe('createIntervalMoistureSensor', () => {
    const pin = 10
    const period = 1

    const createTest = (expectTitle: string, values: DigitalValue[], expected: MoistureState[]) => {
      let mraaMock: MraaMock
      let binarySensor: BinaryMoistureSensor
      let result: MoistureState[]

      beforeAll(async () => {
        mraaMock = new MraaMock()
        mraaMock.readInterval.mockReturnValue(of(...values))

        binarySensor = createIntervalMoistureSensor(mraaMock, pin, period)

        result = await new Promise(resolve =>
          binarySensor.observe().pipe(toArray()).subscribe(value => resolve(value)),
        )
      })

      it(expectTitle, () => expect(result).toEqual(expected))
    }

    describe('when a single 1 value is read', () => {
      createTest('should return a single moist', [1], [Moist])
    })
  })

  describe('isMoist', () => {
    it('should return true when is moist', () => expect(isMoist(Moist)).toBe(true))
    it('should return false when is dry', () => expect(isMoist(Dry)).toBe(false))
  })

  describe('isDry', () => {
    it('should return false when is moist', () => expect(isDry(Moist)).toBe(false))
    it('should return true when is dry', () => expect(isDry(Dry)).toBe(true))
  })

})