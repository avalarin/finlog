export interface Logger {
    debug(message: string): void
    info(message: string): void
    warn(message: string): void
    error(message: string, error: unknown): void
}

export const createLogger = (): Logger => ({
  debug: msg => console.debug(msg),
  info: msg => console.log(msg),
  warn: msg => console.warn(msg),
  error: (msg, error) => console.error(msg, error)
})
