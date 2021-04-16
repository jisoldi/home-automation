import { Logger } from './logger'

export class SilentLogger implements Logger {
  log(): void {}
}