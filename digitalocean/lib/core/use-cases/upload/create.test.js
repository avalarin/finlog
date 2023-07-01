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
describe('CreateUseCase', () => {
    const storage = {
        getUpload: globals_1.jest.fn((id, ownerId) => __awaiter(void 0, void 0, void 0, function* () { return ({ id, ownerId, date: new Date(), status: 'new', params: {}, rawContent: '', rowsCount: 0 }); })),
        createUpload: globals_1.jest.fn((ownerId) => __awaiter(void 0, void 0, void 0, function* () { return ({ id: 1, ownerId }); })),
        updateUploadContent: globals_1.jest.fn(() => __awaiter(void 0, void 0, void 0, function* () { })),
        updateUploadStatus: globals_1.jest.fn(() => __awaiter(void 0, void 0, void 0, function* () { })),
    };
    const defaultMatcher = {
        match: globals_1.jest.fn((_userId, _contentString, params) => __awaiter(void 0, void 0, void 0, function* () { return ({ params }); }))
    };
    it('should create a new upload with the specified owner ID, params, and rows', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = {
            ownerId: 1,
            params: { rowDelimiter: '\n', fieldDelimiter: '\t' },
            contentString: 'r1c1\tr1c2\tr1c3\nr2c1\tr2c2\tr2c3\nr3c1\tr3c2\tr3c3'
        };
        const useCase = new create_1.CreateUploadUseCase(storage, defaultMatcher);
        const result = yield useCase.do(req);
        (0, globals_1.expect)(storage.createUpload).toHaveBeenCalledWith(req.ownerId, [['r1c1', 'r1c2', 'r1c3'], ['r2c1', 'r2c2', 'r2c3'], ['r3c1', 'r3c2', 'r3c3']], 'r1c1\tr1c2\tr1c3\nr2c1\tr2c2\tr2c3\nr3c1\tr3c2\tr3c3', req.params);
        (0, globals_1.expect)(result).toEqual({ id: 1, params: req.params });
    }));
    it('should call DataDeterminator and use params from it', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = {
            ownerId: 1,
            params: { rowDelimiter: 'x', fieldDelimiter: 'x' },
            contentString: 'r1c1\tr1c2\tr1c3\nr2c1\tr2c2\tr2c3\nr3c1\tr3c2\tr3c3'
        };
        const newParams = { rowDelimiter: '\n', fieldDelimiter: '\t' };
        const matcher = {
            match: globals_1.jest.fn(() => __awaiter(void 0, void 0, void 0, function* () { return ({ params: newParams }); }))
        };
        const useCase = new create_1.CreateUploadUseCase(storage, matcher);
        const result = yield useCase.do(req);
        (0, globals_1.expect)(storage.createUpload).toHaveBeenCalledWith(req.ownerId, [['r1c1', 'r1c2', 'r1c3'], ['r2c1', 'r2c2', 'r2c3'], ['r3c1', 'r3c2', 'r3c3']], 'r1c1\tr1c2\tr1c3\nr2c1\tr2c2\tr2c3\nr3c1\tr3c2\tr3c3', newParams);
        (0, globals_1.expect)(result).toEqual({ id: 1, params: newParams });
    }));
    it('should not parse rows if rowDelimiter isn\'t correct', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = {
            ownerId: 1,
            params: { rowDelimiter: 'x', fieldDelimiter: '\t' },
            contentString: 'r1c1\tr1c2\tr1c3\nr2c1\tr2c2\tr2c3\nr3c1\tr3c2\tr3c3'
        };
        const useCase = new create_1.CreateUploadUseCase(storage, defaultMatcher);
        const result = yield useCase.do(req);
        (0, globals_1.expect)(storage.createUpload).toHaveBeenCalledWith(req.ownerId, [['r1c1', 'r1c2', 'r1c3\nr2c1', 'r2c2', 'r2c3\nr3c1', 'r3c2', 'r3c3']], 'r1c1\tr1c2\tr1c3\nr2c1\tr2c2\tr2c3\nr3c1\tr3c2\tr3c3', req.params);
        (0, globals_1.expect)(result).toEqual({ id: 1, params: req.params });
    }));
    it('should not parse rows if fieldDelimiter isn\'t correct', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = {
            ownerId: 1,
            params: { rowDelimiter: '\n', fieldDelimiter: 'x' },
            contentString: 'r1c1\tr1c2\tr1c3\nr2c1\tr2c2\tr2c3\nr3c1\tr3c2\tr3c3'
        };
        const useCase = new create_1.CreateUploadUseCase(storage, defaultMatcher);
        const result = yield useCase.do(req);
        (0, globals_1.expect)(storage.createUpload).toHaveBeenCalledWith(req.ownerId, [['r1c1\tr1c2\tr1c3'], ['r2c1\tr2c2\tr2c3'], ['r3c1\tr3c2\tr3c3']], 'r1c1\tr1c2\tr1c3\nr2c1\tr2c2\tr2c3\nr3c1\tr3c2\tr3c3', req.params);
        (0, globals_1.expect)(result).toEqual({ id: 1, params: req.params });
    }));
    it('should throw an error if the owner ID is not specified', () => {
        const req = {
            ownerId: undefined,
            params: { rowDelimiter: '\n', fieldDelimiter: '\t' },
            contentString: 'r1c1\tr1c2\tr1c3\nr2c1\tr2c2\tr2c3\nr3c1\tr3c2\tr3c3'
        };
        const useCase = new create_1.CreateUploadUseCase(storage, defaultMatcher);
        (0, globals_1.expect)(useCase.do(req)).rejects.toThrow();
    });
    it('should throw an error if the content string is empty', () => {
        const req = {
            ownerId: 1,
            params: { rowDelimiter: '\n', fieldDelimiter: '\t' },
            contentString: ''
        };
        const useCase = new create_1.CreateUploadUseCase(storage, defaultMatcher);
        (0, globals_1.expect)(useCase.do(req)).rejects.toThrow();
    });
});
//# sourceMappingURL=create.test.js.map