import { Logger } from './logger'
import { tap } from 'rxjs/operators'
import { OperatorFunction } from 'rxjs'

export type WithToString = { toString(): string }

export const loggerToTap = (logger: Logger) =>
  <T extends WithToString>(title: string): OperatorFunction<T, T> =>
    tap<T>(value => logger.log(title, '-', value))