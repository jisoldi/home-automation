import { BinaryState, createSimpleBinaryStateGuard } from './binaryState'

export const AvailableState = 'available' as const
export type AvailableStateType = typeof AvailableState

export const UnavailableState = 'unavailable'
export type UnavailableStateType = typeof UnavailableState

export type AvailabilityState = BinaryState<AvailableStateType, UnavailableStateType>

export const isAvailable = createSimpleBinaryStateGuard<AvailableStateType, UnavailableStateType>(AvailableState)
