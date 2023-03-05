export class CommandError extends Error {
  userMessage: string

  constructor(userMessage: string) {
    super('command error: ' + userMessage)

    this.userMessage = userMessage

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, CommandError.prototype)
  }
}
