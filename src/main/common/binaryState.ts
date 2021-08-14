import { Guard } from './guard'

export type BinaryState<A, B> = A | B

export type BinaryStateGuard<A, B, S extends BinaryState<A, B>> = Guard<BinaryState<A, B>, S>

export const createSimpleBinaryStateGuard = <A, B>(ref: A): BinaryStateGuard<A, B, A> => (value): value is A => value === ref

export type BinaryStateNot<A, B> = (state: BinaryState<A, B>) => typeof state extends A ? B : A

export const createSimpleBinaryStateNot = <A, B>(a: A, b: B) =>
  (state: BinaryState<A, B>): typeof state extends A ? B : A => (state === a ? b : a) as typeof state extends A ? B : A