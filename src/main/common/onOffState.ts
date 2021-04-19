import { BinaryState } from './binaryState'

export const OnState = 'on' as const
export type OnStateType = typeof OnState

export const OffState = 'off' as const
export type OffStateType = typeof OffState

export type OnOffState = BinaryState<OnStateType, OffStateType>

export const isOnState = (state: OnOffState): state is OnStateType => state === OnState

export const isOffState = (state: OnOffState): state is OffStateType => state === OffState