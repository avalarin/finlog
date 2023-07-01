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
const logger_1 = require("../../../utils/logger");
const matcher_1 = require("./matcher");
jest.setTimeout(10000);
describe('AIDataMatcher', () => {
    const valuesProvider = {
        getAccounts: () => __awaiter(void 0, void 0, void 0, function* () { return [{ id: 1, name: 'Savings USD' }, { id: 2, name: 'Current USD' }, { id: 3, name: 'Current EUR' }]; }),
        getCategories: () => __awaiter(void 0, void 0, void 0, function* () { return [{ id: 100, name: 'Питание' }, { id: 101, name: 'Подписки' }, { id: 102, name: 'Путешествия' }]; }),
        getCurrencies: () => __awaiter(void 0, void 0, void 0, function* () { return [{ id: 'USD', name: 'USD' }, { id: 'EUR', name: 'EUR' }, { id: 'RUB', name: 'RUB' }]; }),
    };
    const matcher = new matcher_1.AIDataMatcher(valuesProvider, (0, logger_1.createLogger)());
    it('sould detect row and field delimiter', () => __awaiter(void 0, void 0, void 0, function* () {
        const content = makeContent([
            ['Подписки', '01.02.2023', '100.00', 'USD', 'Тестовый платеж'],
            ['Путешествия', '03.02.2023', '5500.00', 'USD', 'Тестовый платеж'],
            ['Питание', '20.02.2023', '4500.00', 'RUB', 'Тестовый платеж']
        ]);
        const result = yield matcher.match(1, content, { fields: [], accountMapping: {}, categoryMapping: {}, currencyMapping: {} });
        expect(result.params.rowDelimiter).toEqual('\n');
        expect(result.params.fieldDelimiter).toEqual('\t');
    }));
    it('should detect field types', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        const content = makeContent([
            ['Подписки', '01.02.2023', '100.00', 'USD', 'Тестовый платеж'],
            ['Путешествия', '03.02.2023', '5500.00', 'USD', 'Тестовый платеж'],
            ['Питание', '20.02.2023', '4500.00', 'RUB', 'Тестовый платеж']
        ]);
        const result = yield matcher.match(1, content, { rowDelimiter: '\n', fieldDelimiter: '\t', accountMapping: {}, categoryMapping: {}, currencyMapping: {} });
        expect((_b = (_a = result.params.fields) === null || _a === void 0 ? void 0 : _a.find(f => f.order === 0)) === null || _b === void 0 ? void 0 : _b.type).toEqual('category');
        expect((_d = (_c = result.params.fields) === null || _c === void 0 ? void 0 : _c.find(f => f.order === 1)) === null || _d === void 0 ? void 0 : _d.type).toEqual('date');
        expect((_f = (_e = result.params.fields) === null || _e === void 0 ? void 0 : _e.find(f => f.order === 2)) === null || _f === void 0 ? void 0 : _f.type).toEqual('amount1');
        expect((_h = (_g = result.params.fields) === null || _g === void 0 ? void 0 : _g.find(f => f.order === 3)) === null || _h === void 0 ? void 0 : _h.type).toEqual('currency1');
        expect((_k = (_j = result.params.fields) === null || _j === void 0 ? void 0 : _j.find(f => f.order === 4)) === null || _k === void 0 ? void 0 : _k.type).toEqual('comment');
        expect((_m = (_l = result.params.fields) === null || _l === void 0 ? void 0 : _l.find(f => f.type === 'account1')) === null || _m === void 0 ? void 0 : _m.order).toBeUndefined();
    }));
    it('should detect mapping of categories', () => __awaiter(void 0, void 0, void 0, function* () {
        const content = makeContent([
            ['Savings USD', '🏝️ Путешествия', 'USD'],
            ['Current USD', '🥦 Питание', 'RUB'],
            ['Current EUR', '🎖️ Подписки', 'EUR']
        ]);
        const inParams = {
            rowDelimiter: '\n',
            fieldDelimiter: '\t',
            fields: [
                { order: 0, type: 'account1' },
                { order: 1, type: 'category' },
                { order: 2, type: 'currency1' }
            ]
        };
        const result = yield matcher.match(1, content, inParams);
        expect(result.params.accountMapping).toEqual({
            'Savings USD': 1,
            'Current USD': 2,
            'Current EUR': 3
        });
        expect(result.params.categoryMapping).toEqual({
            '🥦 Питание': 100,
            '🎖️ Подписки': 101,
            '🏝️ Путешествия': 102
        });
        expect(result.params.currencyMapping).toEqual({
            'USD': 'USD',
            'RUB': 'RUB',
            'EUR': 'EUR'
        });
    }));
});
const makeContent = (rows) => rows.map(row => row.join('\t')).join('\n');
//# sourceMappingURL=matcher.test.js.map