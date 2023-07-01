"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const decimal_js_1 = __importDefault(require("decimal.js"));
const parser_1 = require("./parser");
const makeContent = (rows) => rows.map(row => row.join('\t')).join('\n');
describe('Parser', () => {
    const content = makeContent([
        ['Подписки', '01.02.2023', '100.00', 'USD', 'Тестовый платеж'],
        ['Путешествия', '03.02.2023', '5500.00', 'USD', 'Тестовый платеж'],
        ['Питание', '20.02.2023', '4500.00', 'RUB', 'Тестовый платеж']
    ]);
    it('should parse raw data', () => {
        const parser = new parser_1.Parser(content, { fieldDelimiter: '\t', rowDelimiter: '\n' });
        // raw data should be parsed
        expect(parser.getRows()).toHaveLength(3);
        expect(parser.getRows()[0].raw).toEqual(content.split('\n')[0]);
        expect(parser.getRows()[0].fields).toEqual(['Подписки', '01.02.2023', '100.00', 'USD', 'Тестовый платеж']);
        // all fields should be undefined
        expect(parser.getRows()[0].date).toBeDefined();
        expect(parser.getRows()[0].comment).toBeUndefined();
        expect(parser.getRows()[0].category).toBeUndefined();
        expect(parser.getRows()[0].amount1).toBeUndefined();
        expect(parser.getRows()[0].amount2).toBeUndefined();
        expect(parser.getRows()[0].currency1).toBeUndefined();
        expect(parser.getRows()[0].currency2).toBeUndefined();
        expect(parser.getRows()[0].account1).toBeUndefined();
        expect(parser.getRows()[0].account2).toBeUndefined();
        expect(parser.getRows()[0].exchangeRate1).toBeUndefined();
        expect(parser.getRows()[0].exchangeRate2).toBeUndefined();
    });
    it('should parse fields without mappings', () => {
        const parser = new parser_1.Parser(content, {
            fieldDelimiter: '\t', rowDelimiter: '\n',
            fields: [
                { order: 0, type: 'category' },
                { order: 1, type: 'date', format: 'dd.MM.yyyy' },
                { order: 2, type: 'amount1', format: '0.00' },
                { order: 3, type: 'currency1' },
                { order: 4, type: 'comment' },
                { order: -1, type: 'account1', defaultValue: 1 }
            ]
        });
        // some fields should be undefined
        expect(parser.getRows()[0].date).toEqual({ value: (0, date_fns_1.parseISO)('2023-02-01'), raw: '01.02.2023' });
        expect(parser.getRows()[0].comment).toEqual({ value: 'Тестовый платеж', raw: 'Тестовый платеж' });
        expect(parser.getRows()[0].category).toEqual({ value: undefined, raw: 'Подписки' });
        expect(parser.getRows()[0].amount1).toEqual({ value: new decimal_js_1.default(100), raw: '100.00' });
        expect(parser.getRows()[0].amount2).toBeUndefined();
        expect(parser.getRows()[0].currency1).toEqual({ value: undefined, raw: 'USD' });
        expect(parser.getRows()[0].currency2).toBeUndefined();
        expect(parser.getRows()[0].account1).toEqual({ value: 1, raw: undefined });
        expect(parser.getRows()[0].account2).toBeUndefined();
        expect(parser.getRows()[0].exchangeRate1).toBeUndefined();
        expect(parser.getRows()[0].exchangeRate2).toBeUndefined();
    });
    it('should use mappings', () => {
        const parser = new parser_1.Parser(content, {
            fieldDelimiter: '\t', rowDelimiter: '\n',
            fields: [
                { order: 0, type: 'category' },
                { order: 1, type: 'date', format: 'dd.MM.yyyy' },
                { order: 2, type: 'amount1', format: '0.00' },
                { order: 3, type: 'currency1' },
                { order: 4, type: 'comment' },
                { order: -1, type: 'account1', defaultValue: 1 }
            ],
            accountMapping: {},
            categoryMapping: { 'Подписки': 100, 'Путешествия': 200 },
            currencyMapping: { 'USD': 'USD', 'RUB': 'RUB' }
        });
        // some fields should be undefined
        expect(parser.getRows()[0].date).toEqual({ value: (0, date_fns_1.parseISO)('2023-02-01'), raw: '01.02.2023' });
        expect(parser.getRows()[0].comment).toEqual({ value: 'Тестовый платеж', raw: 'Тестовый платеж' });
        expect(parser.getRows()[0].category).toEqual({ value: 100, raw: 'Подписки' });
        expect(parser.getRows()[0].amount1).toEqual({ value: new decimal_js_1.default(100), raw: '100.00' });
        expect(parser.getRows()[0].amount2).toBeUndefined();
        expect(parser.getRows()[0].currency1).toEqual({ value: 'USD', raw: 'USD' });
        expect(parser.getRows()[0].currency2).toBeUndefined();
        expect(parser.getRows()[0].account1).toEqual({ value: 1, raw: undefined });
        expect(parser.getRows()[0].account2).toBeUndefined();
        expect(parser.getRows()[0].exchangeRate1).toBeUndefined();
        expect(parser.getRows()[0].exchangeRate2).toBeUndefined();
    });
    it('should re-parse after calling setParams', () => {
        const params = {
            fieldDelimiter: '\t', rowDelimiter: '\n',
            fields: [
                { order: 0, type: 'category' },
                { order: 1, type: 'date', format: 'dd.MM.yyyy' },
                { order: 2, type: 'amount1', format: '0.00' },
                { order: 3, type: 'currency1' },
                { order: 4, type: 'comment' },
                { order: -1, type: 'account1', defaultValue: 1 }
            ]
        };
        const parser = new parser_1.Parser(content, params);
        expect(parser.getRows()[0].category).toEqual({ value: undefined, raw: 'Подписки' });
        parser.setParams(Object.assign(Object.assign({}, params), { categoryMapping: { 'Подписки': 200 } }));
        expect(parser.getRows()[0].category).toEqual({ value: 200, raw: 'Подписки' });
    });
});
//# sourceMappingURL=parser.test.js.map