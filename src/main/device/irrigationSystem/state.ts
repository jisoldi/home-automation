import { invertState, OffState, OnOffState, OnState } from '../../common/onOffState'
import { AvailabilityState, AvailableState, isAvailable, UnavailableState } from '../../common/availabilty'

export type State = {
  pumpState: OnOffState
  availability: AvailabilityState
}

export type IrrigationAction =
  | { type: 'set', isOn: boolean }
  | { type: 'tick' }
  | { type: 'toggle' }
  | { type: 'availability', isAvailable: boolean }

export const TickAction: IrrigationAction = {type: 'tick'}

export const ToggleStateAction: IrrigationAction = {type: 'toggle'}

export const setStateAction = (isOn: boolean): IrrigationAction => ({type: 'set', isOn})

export const setAvailabilityAction = (isAvailable: boolean): IrrigationAction => ({type: 'availability', isAvailable})

export const InitialState: State = {
  pumpState: OffState,
  availability: UnavailableState,
}

export const handleIrrigationAction = (state: State, action: IrrigationAction): State => {
  switch (action.type) {
    case 'tick':
      return state
    case 'set':
      return {...state, pumpState: action.isOn && isAvailable(state.availability) ? OnState : OffState}
    case 'toggle':
      return {...state, pumpState: isAvailable(state.availability) ? invertState(state.pumpState) : OffState}
    case 'availability':
      return {
        ...state,
        availability: action.isAvailable ? AvailableState : UnavailableState,
        pumpState: action.isAvailable ? state.pumpState : OffState,
      }
  }
}
