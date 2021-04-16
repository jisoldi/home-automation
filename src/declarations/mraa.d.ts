declare module 'mraa' {

  const DIR_OUT: 0
  const DIR_IN: 1
  const DIR_OUT_HIGH: 2
  const DIR_OUT_LOW: 3

  type Dir = typeof DIR_OUT | typeof DIR_IN | typeof DIR_OUT_HIGH | typeof DIR_OUT_LOW

  const EDGE_NONE: 0
  const EDGE_BOTH: 1
  const EDGE_RISING: 2
  const EDGE_FALLING: 3

  type Edge = typeof EDGE_NONE | typeof EDGE_BOTH | typeof EDGE_RISING | typeof EDGE_FALLING

  const MODE_STRONG: 0
  const MODE_PULLUP: 1
  const MODE_PULLDOWN: 2
  const MODE_HIZ: 3

  type Mode = typeof MODE_STRONG | typeof MODE_PULLUP | typeof MODE_PULLDOWN | typeof MODE_HIZ

  const SUCCESS: 0
  const ERROR_FEATURE_NOT_IMPLEMENTED: 1
  const ERROR_FEATURE_NOT_SUPPORTED: 2
  const ERROR_INVALID_VERBOSITY_LEVEL: 3
  const ERROR_INVALID_PARAMETER: 4
  const ERROR_INVALID_HANDLE: 5
  const ERROR_NO_RESOURCES: 6
  const ERROR_INVALID_RESOURCE: 7
  const ERROR_INVALID_QUEUE_TYPE: 8
  const ERROR_NO_DATA_AVAILABLE: 9
  const ERROR_INVALID_PLATFORM: 10
  const ERROR_PLATFORM_NOT_INITIALISED: 11
  const ERROR_PLATFORM_ALREADY_INITIALISED: 12
  const ERROR_UNSPECIFIED: 99

  type Result =
    | typeof SUCCESS
    | typeof ERROR_FEATURE_NOT_IMPLEMENTED
    | typeof ERROR_FEATURE_NOT_SUPPORTED
    | typeof ERROR_INVALID_VERBOSITY_LEVEL
    | typeof ERROR_INVALID_PARAMETER
    | typeof ERROR_INVALID_HANDLE
    | typeof ERROR_NO_RESOURCES
    | typeof ERROR_INVALID_RESOURCE
    | typeof ERROR_INVALID_QUEUE_TYPE
    | typeof ERROR_NO_DATA_AVAILABLE
    | typeof ERROR_INVALID_PLATFORM
    | typeof ERROR_PLATFORM_NOT_INITIALISED
    | typeof ERROR_PLATFORM_ALREADY_INITIALISED
    | typeof ERROR_UNSPECIFIED

  type Arr = readonly any[];

  type DigitalValue = 1 | 0

  class Gpio {
    constructor(pin: number, owner?: boolean, raw?: boolean)

    /**
     * Change Gpio direction
     *
     * @param dir The direction to change the gpio into
     *
     * @return Result of operation
     */
    dir(dir: Dir): Result

    /**
     * Set the edge mode for ISR
     *
     * @param mode The edge mode to set
     *
     * @return Result of operation
     */
    edge(mode: Edge): Result

    /**
     * Get pin number of Gpio. If raw param is True will return the number as used within sysfs. Invalid will return -1.
     *
     * @param raw get the raw gpio number
     *
     * @return Pin number
     */
    getPin(raw?: boolean): number

    /**
     * Sets a callback to be called when pin value changes
     *
     * @param mode The edge mode to set
     * @param callback Function pointer to function to be called when interrupt is triggered
     * @param callbackArgs Arguments passed to the interrupt handler (callback)
     *
     * @return Result of operation
     */
    isr<T extends Arr>(mode: Edge, callback: (...args: T) => void, ...callbackArgs: T): Result

    /**
     * Exits callback - this call will not kill the isr thread immediately but only when it is out of it’s critical section
     *
     * @return Result of operation
     */
    isrExit(): Result

    /**
     * Change Gpio mode
     *
     * @param mode The mode to change the gpio into
     *
     * @return Result of operation
     */
    mode(mode: Mode): Result

    /**
     * Change Gpio mode
     *
     * @return Gpio value
     */
    read(): DigitalValue

    /**
     * Read value from Gpio
     *
     * @return Dir value
     */
    readDir(): Dir

    /**
     * Enable use of mmap i/o if available
     *
     * @param enable true to use mmap
     *
     * @return Result of operation
     */
    useMmap(enable: boolean): Result

    /**
     * Write value to Gpio
     *
     * @param value Value to write to Gpio
     *
     * @return Result of operation
     */
    write(value: DigitalValue): Result

  }

}