import { DateProvider } from './dateProvider'

export class DefaultDateProvider implements DateProvider {
  now(): Date {
    return new Date()
  }
}