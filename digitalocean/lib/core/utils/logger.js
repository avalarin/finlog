"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogger = void 0;
const createLogger = () => ({
    debug: msg => console.debug(msg),
    info: msg => console.log(msg),
    warn: msg => console.warn(msg),
    error: (msg, error) => console.error(msg, error)
});
exports.createLogger = createLogger;
//# sourceMappingURL=logger.js.map