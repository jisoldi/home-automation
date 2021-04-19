import {
  handleIrrigationAction,
  InitialState,
  IrrigationAction, setAvailabilityAction, setStateAction,
  State,
  TickAction, ToggleStateAction,
} from '../../../main/device/irrigationSystem/state'
import { AvailabilityState, AvailableState, UnavailableState } from '../../../main/common/availabilty'
import { OffState, OnOffState, OnState } from '../../../main/common/onOffState'

describe('handleIrrigationAction', () => {
  const applyActionAndAssert = (state: State, action: IrrigationAction, pumpState: OnOffState, availability: AvailabilityState) => {
    const  newState = handleIrrigationAction(state, action)

    assertState(newState, pumpState, availability)
  }

  const assertState = (state: State, pumpState: OnOffState, availability: AvailabilityState) => {
    expect(state.pumpState).toBe(pumpState)
    expect(state.availability).toBe(availability)
  }

  describe('when initial state', () => {
    const state = InitialState

    test('on tick action', () => applyActionAndAssert(state, TickAction, OffState, UnavailableState))

    test('on toggle action', () => applyActionAndAssert(state, ToggleStateAction, OffState, UnavailableState))

    test('on set off action', () => applyActionAndAssert(state, setStateAction(false), OffState, UnavailableState))

    test('on set on action', () => applyActionAndAssert(state, setStateAction(true), OffState, UnavailableState))

    test('on set unavailable action', () => applyActionAndAssert(state, setAvailabilityAction(false), OffState, UnavailableState))

    test('on set available action', () => applyActionAndAssert(state, setAvailabilityAction(true), OffState, AvailableState))
  })

  describe('when available state', () => {
    const state = {...InitialState, availability: AvailableState}

    test('on tick action', () => applyActionAndAssert(state, TickAction, OffState, AvailableState))

    test('on toggle action', () => applyActionAndAssert(state, ToggleStateAction, OnState, AvailableState))

    test('on set off action', () => applyActionAndAssert(state, setStateAction(false), OffState, AvailableState))

    test('on set on action', () => applyActionAndAssert(state, setStateAction(true), OnState, AvailableState))

    test('on set unavailable action', () => applyActionAndAssert(state, setAvailabilityAction(false), OffState, UnavailableState))

    test('on set available action', () => applyActionAndAssert(state, setAvailabilityAction(true), OffState, AvailableState))
  })

  describe('when available and on state', () => {
    const state = {...InitialState, availability: AvailableState, pumpState: OnState}

    test('on tick action', () => applyActionAndAssert(state, TickAction, OnState, AvailableState))

    test('on toggle action', () => applyActionAndAssert(state, ToggleStateAction, OffState, AvailableState))

    test('on set off action', () => applyActionAndAssert(state, setStateAction(false), OffState, AvailableState))

    test('on set on action', () => applyActionAndAssert(state, setStateAction(true), OnState, AvailableState))

    test('on set unavailable action', () => applyActionAndAssert(state, setAvailabilityAction(false), OffState, UnavailableState))

    test('on set available action', () => applyActionAndAssert(state, setAvailabilityAction(true), OnState, AvailableState))
  })

  describe('when unavailable and on state', () => {
    const state = {...InitialState, pumpState: OnState}

    test('on tick action', () => applyActionAndAssert(state, TickAction, OnState, UnavailableState))

    test('on toggle action', () => applyActionAndAssert(state, ToggleStateAction, OffState, UnavailableState))

    test('on set off action', () => applyActionAndAssert(state, setStateAction(false), OffState, UnavailableState))

    test('on set on action', () => applyActionAndAssert(state, setStateAction(true), OffState, UnavailableState))

    test('on set unavailable action', () => applyActionAndAssert(state, setAvailabilityAction(false), OffState, UnavailableState))

    test('on set available action', () => applyActionAndAssert(state, setAvailabilityAction(true), OnState, AvailableState))
  })
})