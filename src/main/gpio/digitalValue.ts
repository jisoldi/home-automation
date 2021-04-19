import { BinaryState, createSimpleBinaryStateGuard } from '../common/binaryState'

export const ZeroValue = 0 as const
export type ZeroValueType = typeof ZeroValue

export const OneValue = 1 as const
export type OneValueType = typeof OneValue

export type DigitalValue = BinaryState<ZeroValueType, OneValueType>

export const isZero = createSimpleBinaryStateGuard<ZeroValueType, OneValueType>(ZeroValue)

export const isOne = createSimpleBinaryStateGuard<OneValueType, ZeroValueType>(OneValue)

export const negate = (value: DigitalValue): DigitalValue => isZero(value) ? OneValue : ZeroValue