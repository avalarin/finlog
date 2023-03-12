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
    handle(command, args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (command === 'create') {
                const { ownerId, contentString, params } = args;
                return yield this.create(ownerId, contentString, params);
            }
            else if (command === 'get') {
                const { id, ownerId } = args;
                return yield this.get(id, ownerId);
            }
            else if (command === 'update_params') {
                const { id, ownerId, params } = args;
                return yield this.updateParams(id, ownerId, params);
            }
            else if (command === 'complete') {
                const { id, ownerId } = args;
                return yield this.complete(id, ownerId);
            }
            else {
                throw new error_1.CommandError(`Unknown command ${command}`);
            }
        });
    }
    get(idArg, ownerIdArg) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!idArg)
                throw new error_1.CommandError('id should be present');
            const id = Number(idArg);
            if (isNaN(id))
                throw new error_1.CommandError('id has invalid number');
            if (!ownerIdArg)
                throw new error_1.CommandError('ownerId should be present');
            const ownerId = Number(ownerIdArg);
            if (isNaN(ownerId))
                throw new error_1.CommandError('ownerId has invalid number');
            return yield this._storage.getUpload(id, ownerId);
        });
    }
    create(ownerIdArg, contentString, paramsArg) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!ownerIdArg)
                throw new error_1.CommandError('ownerId should be present');
            const ownerId = Number(ownerIdArg);
            if (isNaN(ownerId))
                throw new error_1.CommandError('ownerId has invalid number');
            if (!contentString) {
                throw new error_1.CommandError('contentString should be present');
            }
            let params;
            try {
                params = paramsArg ? JSON.parse(paramsArg) : {};
            }
            catch (_a) {
                throw new error_1.CommandError('params should be json string');
            }
            const req = { ownerId, params: params || {}, contentString };
            const usecase = new create_1.CreateUploadUseCase(this._storage, req);
            return yield usecase.do();
        });
    }
    updateParams(idArg, ownerIdArg, paramsArg) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!idArg)
                throw new error_1.CommandError('id should be present');
            const id = Number(idArg);
            if (isNaN(id))
                throw new error_1.CommandError('id has invalid number');
            if (!ownerIdArg)
                throw new error_1.CommandError('ownerId should be present');
            const ownerId = Number(ownerIdArg);
            if (isNaN(ownerId))
                throw new error_1.CommandError('ownerId has invalid number');
            let params;
            if (!paramsArg)
                throw new error_1.CommandError('params should be present');
            try {
                params = JSON.parse(paramsArg);
            }
            catch (_a) {
                throw new error_1.CommandError('params should be json string');
            }
            this._logger.info(`updateParams ${id}, ${ownerId}, ${params}`);
            return;
        });
    }
    complete(idArg, ownerIdArg) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!idArg)
                throw new error_1.CommandError('id should be present');
            const id = Number(idArg);
            if (isNaN(id))
                throw new error_1.CommandError('id has invalid number');
            if (!ownerIdArg)
                throw new error_1.CommandError('ownerId should be present');
            const ownerId = Number(ownerIdArg);
            if (isNaN(ownerId))
                throw new error_1.CommandError('ownerId has invalid number');
            this._logger.info(`updateParams ${id}, ${ownerId}`);
            return;
        });
    }
}
exports.UploadHandler = UploadHandler;
//# sourceMappingURL=upload.js.map