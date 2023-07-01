"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.callCommand = void 0;
const logger_1 = require("../utils/logger");
const error_1 = require("../utils/error");
const update_currency_rates_1 = require("./update-currency-rates");
const commands = {
    'update-currency-rates': update_currency_rates_1.updateCurrencyRates
};
const callCommand = (command, req) => __awaiter(void 0, void 0, void 0, function* () {
    const logger = (0, logger_1.createLogger)();
    const cmd = commands[command];
    if (!cmd) {
        logger.warn(`Unable to find command ${command}`);
        return {
            body: {
                status: 'not-found',
                error: 'unknown command'
            }
        };
    }
    try {
        const result = yield cmd(req);
        return {
            body: {
                status: 'ok',
                result
            }
        };
    }
    catch (err) {
        if (err instanceof error_1.CommandError) {
            return {
                body: {
                    status: 'error',
                    error: err.userMessage
                }
            };
        }
        logger.error(`Command ${command} failed`, err);
        return {
            body: {
                status: 'error',
                error: 'unexpected server error'
            }
        };
    }
});
exports.callCommand = callCommand;
//# sourceMappingURL=index.js.map