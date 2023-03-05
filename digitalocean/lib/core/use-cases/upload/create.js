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
class CreateUploadUseCase {
    constructor(storage, req) {
        this._storage = storage;
        this._req = req;
    }
    do() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._req.contentString) {
                throw new Error('Content string is empty');
            }
            const rowDelimiter = this._req.params.rowDelimiter || '\n';
            const fieldDelimiter = this._req.params.fieldDelimiter || '\t';
            const rows = this._req.contentString.split(rowDelimiter)
                .map(r => r.split(fieldDelimiter));
            const upload = yield this._storage.createUpload(this._req.ownerId, rows, this._req.params);
            return {
                id: upload.id,
                params: this._req.params
            };
        });
    }
}
exports.CreateUploadUseCase = CreateUploadUseCase;
//# sourceMappingURL=create.js.map