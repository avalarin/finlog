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
exports.CreateUploadUseCase = void 0;
const parser_1 = require("./service/parser");
class CreateUploadUseCase {
    constructor(_storage, _dataMatcher) {
        this._storage = _storage;
        this._dataMatcher = _dataMatcher;
    }
    do(req) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.ownerId) {
                throw new Error('Argument [ownerId] is required');
            }
            if (!req.contentString) {
                throw new Error('Argument [contentString] is required');
            }
            const matchResult = yield this._dataMatcher.match(req.ownerId, req.contentString, req.params);
            const parser = new parser_1.Parser(req.contentString, matchResult.params);
            const rows = parser.getRows().map(r => r.fields);
            const upload = yield this._storage.createUpload(req.ownerId, rows, req.contentString, matchResult.params);
            return {
                id: upload.id,
                params: matchResult.params
            };
        });
    }
}
exports.CreateUploadUseCase = CreateUploadUseCase;
//# sourceMappingURL=create.js.map