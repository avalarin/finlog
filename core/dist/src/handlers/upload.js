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
exports.UploadHandler = void 0;
const create_1 = require("../use-cases/upload/create");
const error_1 = require("../utils/error");
class UploadHandler {
    constructor(storage, logger) {
        this._storage = storage;
        this._logger = logger;
    }
    get(id, ownerId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id) {
                throw new error_1.CommandError('id should be present');
            }
            if (!ownerId) {
                throw new error_1.CommandError('ownerId should be present');
            }
            return yield this._storage.getUpload(id, ownerId);
        });
    }
    create(ownerId, contentString, params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!ownerId) {
                throw new error_1.CommandError('ownerId should be present');
            }
            if (!contentString) {
                throw new error_1.CommandError('contentString should be present');
            }
            const req = { ownerId, params: params || {}, contentString };
            const usecase = new create_1.CreateUploadUseCase(this._storage, req);
            return yield usecase.do();
        });
    }
    updateParams(id, ownerId, params) {
        return __awaiter(this, void 0, void 0, function* () {
            this._logger.info(`updateParams ${id}, ${ownerId}, ${params}`);
            return;
        });
    }
    complete(id, ownerId) {
        return __awaiter(this, void 0, void 0, function* () {
            this._logger.info(`updateParams ${id}, ${ownerId}`);
            return;
        });
    }
}
exports.UploadHandler = UploadHandler;
//# sourceMappingURL=upload.js.map