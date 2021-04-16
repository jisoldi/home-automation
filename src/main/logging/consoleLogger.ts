import { Logger } from './logger'
import { DateProvider } from '../date/dateProvider'

export class ConsoleLogger implements Logger {
  constructor(private readonly provider: DateProvider) {}

  log(...args: any): void {
    console.log(`[${this.calcTimeStampString()}]`, ...args)
  }

  private calcTimeStampString(): string {
    return this.provider.now().toUTCString()
  }
}
