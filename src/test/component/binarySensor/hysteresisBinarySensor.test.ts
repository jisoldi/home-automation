import { TestScheduler } from 'rxjs/testing';
import { throttleTime } from 'rxjs/operators';
import {
  invertState,
  isOnState,
  OffState,
  OffStateType,
  OnOffState,
  OnState,
  OnStateType,
} from '../../../main/common/onOffState'
import { HysteresisBinarySensor } from '../../../main/component/binarySensor/hysteresisBinarySensor'

describe('HysteresisBinarySensor', () => {
  const possibleStates = {
    'a': OnState as OnOffState,
    'b': OffState as OnOffState,
  }

  const testScheduler = new TestScheduler((actual, expected) => {
    // asserting the two objects are equal - required
    // for TestScheduler assertions to work via your test framework
    // e.g. using chai.
    expect(actual).toEqual(expected);
  });

// This test runs synchronously.
  it('generates the stream correctly', () => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable, expectSubscriptions } = helpers;
      const sensor1 = cold(' -a--b---a|', possibleStates);
      const sensor2 = cold(' --a--b-a-|', possibleStates);
      const expected = '             --a-ab-ba|';


      const sensorOut = new HysteresisBinarySensor<OnStateType, OffStateType>(
        {observe: () => sensor1},
        {observe: () => sensor2},
        OffState,
        isOnState,
        invertState
      ).observe()

      expectObservable(sensorOut).toBe(expected, possibleStates);
    });
  });
})