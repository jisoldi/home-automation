import { Guard } from './guard'

export type BinaryState<A, B> = A | B

export type BinaryStateGuard<A, B, C extends BinaryState<A, B>> = Guard<BinaryState<A, B>, C>

export const createSimpleBinaryStateGuard = <A, B>(ref: A): BinaryStateGuard<A, B, A> => (value): value is A => value === ref