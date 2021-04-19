export const ZeroValue = 0 as const
export type ZeroValueType = typeof ZeroValue

export const OneValue = 1 as const
export type OneValueType = typeof OneValue

export type DigitalValue = ZeroValueType | OneValueType

export const isZero = (value: DigitalValue): value is ZeroValueType => value === ZeroValue

export const isOne = (value: DigitalValue): value is OneValueType => value === OneValue

export const negate = (value: DigitalValue): DigitalValue => isZero(value) ? OneValue : ZeroValue