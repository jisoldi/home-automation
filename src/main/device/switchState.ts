export type SwitchState = {
  isOn: boolean
  isAvailable: boolean
}

export type SwitchAction =
  | { type: 'set', isOn: boolean }
  | { type: 'tick' }
  | { type: 'toggle' }
  | { type: 'availability', isAvailable: boolean }

export const InitialState: SwitchState = {
  isOn: false,
  isAvailable: false,
}

export const handleSwitchAction = (state: SwitchState, event: SwitchAction): SwitchState => {
  switch (event.type) {
    case 'tick':
      return state
    case 'set':
      return {...state, isOn: event.isOn && state.isAvailable}
    case 'toggle':
      return {...state, isOn: !state.isOn && state.isAvailable}
    case 'availability':
      return {...state, isAvailable: event.isAvailable, isOn: state.isOn && state.isAvailable}
  }
}
