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
// jest.mock('../../storage/uploads')
// jest.mock('../../services/operations')
describe('CompleteUploadUseCase', () => {
    let storage;
    let operations;
    const upload = {
        id: 1, ownerId: 1, date: new Date(), status: 'new',
        params: {}, rawContent: '', rowsCount: 0
    };
    const rows = [
        // simple operation
        {
            rowData: [],
            fields: { date: new Date(), categoryId: 1, comment: 'test', accountId1: 1, amount1: 200, currency1: 'RUB', exchangeRate1: 1.00 }
        },
        // transfer - two operations
        {
            rowData: [],
            fields: { date: new Date(), categoryId: 1, comment: 'test', accountId1: 1, amount1: 200, currency1: 'RUB', exchangeRate1: 1.00,
                accountId2: 2, amount2: 800, currency2: 'KZT', exchangeRate2: 1.00 }
        },
        // different currencies - exchange rate
        {
            rowData: [],
            fields: { date: new Date(), categoryId: 1, comment: 'test', accountId1: 1, amount1: 800, currency1: 'KZT', exchangeRate1: 5.00 }
        },
    ];
    beforeEach(() => {
        storage = {
            getUpload: globals_1.jest.fn(() => __awaiter(void 0, void 0, void 0, function* () { return upload; })),
            getRows: globals_1.jest.fn(() => __awaiter(void 0, void 0, void 0, function* () { return rows; })),
            createUpload: globals_1.jest.fn((ownerId) => __awaiter(void 0, void 0, void 0, function* () { return ({ id: 1, ownerId }); })),
            updateUploadContent: globals_1.jest.fn(() => __awaiter(void 0, void 0, void 0, function* () { })),
            updateUploadStatus: globals_1.jest.fn(() => __awaiter(void 0, void 0, void 0, function* () { })),
        };
        operations = {
            createOperation: globals_1.jest.fn(() => __awaiter(void 0, void 0, void 0, function* () { }))
        };
    });
    it('should call createOperation for each operation in upload', () => {
    });
});
//# sourceMappingURL=complete.test.js.map