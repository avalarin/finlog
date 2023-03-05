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
/* eslint-disable @typescript-eslint/no-empty-function */
const globals_1 = require("@jest/globals");
const create_1 = require("./create");
globals_1.jest.mock('../../storage/uploads');
describe('create', () => {
    const storage = {
        getUpload: globals_1.jest.fn((id, ownerId) => __awaiter(void 0, void 0, void 0, function* () { return ({ id, ownerId, date: new Date(), status: 'new', params: {}, rowsCount: 0 }); })),
        createUpload: globals_1.jest.fn((ownerId) => __awaiter(void 0, void 0, void 0, function* () { return ({ id: 1, ownerId }); })),
        updateUploadParams: globals_1.jest.fn(() => __awaiter(void 0, void 0, void 0, function* () { })),
        updateUploadStatus: globals_1.jest.fn(() => __awaiter(void 0, void 0, void 0, function* () { })),
    };
    it('should create a new upload with the specified owner ID, params, and rows', () => __awaiter(void 0, void 0, void 0, function* () {
        const ownerId = 1;
        const params = { rowDelimiter: '\n', fieldDelimiter: '\t' };
        const contentString = 'r1c1\tr1c2\tr1c3\nr2c1\tr2c2\tr2c3\nr3c1\tr3c2\tr3c3';
        const useCase = new create_1.CreateUploadUseCase(storage, { ownerId, params, contentString });
        const result = yield useCase.do();
        (0, globals_1.expect)(storage.createUpload).toHaveBeenCalledWith(ownerId, [['r1c1', 'r1c2', 'r1c3'], ['r2c1', 'r2c2', 'r2c3'], ['r3c1', 'r3c2', 'r3c3']], params);
        (0, globals_1.expect)(result).toEqual({ id: 1, params });
    }));
    it('should throw an error if the content string is empty', () => {
        const ownerId = 1;
        const params = { rowDelimiter: '\n', colDelimiter: '\r' };
        const contentString = '';
        const useCase = new create_1.CreateUploadUseCase(storage, { ownerId, params, contentString });
        (0, globals_1.expect)(useCase.do()).rejects.toThrow();
    });
});
//# sourceMappingURL=create.test.js.map