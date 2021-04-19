import { MraaMock } from '../../mraa/MraaMock'
import { of } from 'rxjs'
import { toArray } from 'rxjs/operators'
import { DigitalValue } from '../../../main/gpio/digitalValue'
import {
  BinaryMoistureSensor,
  createIntervalMoistureSensor,
  Dry,
  isMoist,
  Moist,
  MoistureState,
} from '../../../main/component/moistureSensor/binaryMoistureSensor'

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

})