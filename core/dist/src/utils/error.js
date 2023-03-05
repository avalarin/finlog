"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandError = void 0;
class CommandError extends Error {
    constructor(userMessage) {
        super('command error: ' + userMessage);
        this.userMessage = userMessage;
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, CommandError.prototype);
    }
}
exports.CommandError = CommandError;
//# sourceMappingURL=error.js.map