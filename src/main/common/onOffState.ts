import { BinaryState, createSimpleBinaryStateGuard, createSimpleBinaryStateNot } from './binaryState'

export const OnState = 'on' as const
export type OnStateType = typeof OnState

export const OffState = 'off' as const
export type OffStateType = typeof OffState

export type OnOffState = BinaryState<OnStateType, OffStateType>

export const isOnState = createSimpleBinaryStateGuard<OnStateType, OffStateType>(OnState)

export const invertState = createSimpleBinaryStateNot<OnStateType, OffStateType>(OnState, OffState)