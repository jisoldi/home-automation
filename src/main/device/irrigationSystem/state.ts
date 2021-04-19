export type State = {
  isOn: boolean
  isAvailable: boolean
}

export type IrrigationAction =
  | { type: 'set', isOn: boolean }
  | { type: 'tick' }
  | { type: 'toggle' }
  | { type: 'availability', isAvailable: boolean }

export const TickAction: IrrigationAction = { type: 'tick' }

export const ToggleStateAction: IrrigationAction = { type: 'toggle' }

export const setStateAction = (isOn: boolean): IrrigationAction => ({ type: 'set', isOn })

export const setAvailabilityAction = (isAvailable: boolean): IrrigationAction => ({ type: 'availability', isAvailable })

export const InitialState: State = {
  isOn: false,
  isAvailable: false,
}

export const handleIrrigationAction = (state: State, event: IrrigationAction): State => {
  switch (event.type) {
    case 'tick':
      return state
    case 'set':
      return {...state, isOn: event.isOn && state.isAvailable}
    case 'toggle':
      return {...state, isOn: !state.isOn && state.isAvailable}
    case 'availability':
      return {...state, isAvailable: event.isAvailable, isOn: event.isAvailable && state.isOn}
  }
}
