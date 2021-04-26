import { BinaryState, createSimpleBinaryStateGuard } from '../common/binaryState'

export const ZeroValue = 0 as const
export type ZeroValueType = typeof ZeroValue

export const OneValue = 1 as const
export type OneValueType = typeof OneValue

export type DigitalValue = BinaryState<ZeroValueType, OneValueType>

export const isOne = createSimpleBinaryStateGuard<OneValueType, ZeroValueType>(OneValue)

export const negate = (value: DigitalValue): DigitalValue => isOne(value) ? ZeroValue : OneValue