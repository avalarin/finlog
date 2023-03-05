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
exports.main = void 0;
const finlog_core_1 = require("finlog-core");
const process = (command, args) => __awaiter(void 0, void 0, void 0, function* () {
    const logger = (0, finlog_core_1.createLogger)();
    const db = (0, finlog_core_1.connectDatabase)(logger);
    const storage = new finlog_core_1.UploadsStorage(db, logger);
    const handler = new finlog_core_1.UploadHandler(storage, logger);
    if (!command)
        throw new finlog_core_1.CommandError('Parameter command is required');
    else if (command === 'start') {
        const { ownerId, contentString, params } = args;
        return yield handler.create(ownerId, contentString, params);
    }
    else if (command === 'get') {
        const { id, ownerId } = args;
        return yield handler.get(id, ownerId);
    }
    else if (command === 'update_params') {
        const { id, ownerId, params } = args;
        return yield handler.updateParams(id, ownerId, params);
    }
    else if (command === 'complete') {
        const { id, ownerId } = args;
        return yield handler.complete(id, ownerId);
    }
    else {
        throw new finlog_core_1.CommandError(`Unknown command ${command}`);
    }
});
const main = (args) => __awaiter(void 0, void 0, void 0, function* () {
    const { command } = args;
    try {
        const result = yield process(command, args);
        return {
            body: {
                status: 'ok',
                result: result
            }
        };
    }
    catch (err) {
        if (err.userMessage) {
            return {
                body: {
                    status: 'error',
                    error: err.userMessage
                }
            };
        }
        console.error('Unexpected error occurred', err);
        return {
            body: {
                status: 'error'
            }
        };
    }
});
exports.main = main;
//# sourceMappingURL=index.js.map