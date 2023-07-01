"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const decimal_js_1 = __importDefault(require("decimal.js"));
const date_fns_1 = require("date-fns");
class Parser {
    constructor(_contentString, _params) {
        this._contentString = _contentString;
        this._params = _params;
        this._rows = [];
        this._parse();
    }
    _parse() {
        const fieldDelimiter = this._params.fieldDelimiter || '\t';
        const rowDelimiter = this._params.rowDelimiter || '\n';
        const getField = (i) => { var _a; return (_a = this._params.fields) === null || _a === void 0 ? void 0 : _a.find(f => f.order === i); };
        const parseField = (value, field) => {
            var _a, _b, _c, _d, _e;
            switch (field.type) {
                case 'date':
                    return { value: (0, date_fns_1.parse)(value, field.format || 'dd.MM.yyyy', new Date()), raw: value };
                case 'comment':
                    return { value: value, raw: value };
                case 'category':
                    return { value: (_a = this._params.categoryMapping) === null || _a === void 0 ? void 0 : _a[value], raw: value };
                case 'account1':
                    return { value: (_b = this._params.accountMapping) === null || _b === void 0 ? void 0 : _b[value], raw: value };
                case 'amount1':
                    return { value: new decimal_js_1.default(value), raw: value };
                case 'currency1':
                    return { value: (_c = this._params.currencyMapping) === null || _c === void 0 ? void 0 : _c[value], raw: value };
                case 'exchangeRate1':
                    return { value: new decimal_js_1.default(value), raw: value };
                case 'account2':
                    return { value: (_d = this._params.accountMapping) === null || _d === void 0 ? void 0 : _d[value], raw: value };
                case 'amount2':
                    return { value: new decimal_js_1.default(value), raw: value };
                case 'currency2':
                    return { value: (_e = this._params.currencyMapping) === null || _e === void 0 ? void 0 : _e[value], raw: value };
                case 'exchangeRate2':
                    return { value: new decimal_js_1.default(value), raw: value };
            }
        };
        this._rows = this._contentString.split(rowDelimiter).map(row => {
            var _a;
            const fields = row.split(fieldDelimiter);
            const defaults = ((_a = this._params.fields) === null || _a === void 0 ? void 0 : _a.filter(f => f.order === -1).reduce((acc, field) => {
                return Object.assign(Object.assign({}, acc), { [field.type]: { value: field.defaultValue, raw: undefined } });
            }, {})) || {};
            return fields
                .reduce((acc, value, i) => {
                const field = getField(i);
                if (!field)
                    return acc;
                return Object.assign(Object.assign({}, acc), { [field.type]: parseField(value, field) });
            }, Object.assign({ raw: row, fields }, defaults));
        });
    }
    setParams(params) {
        this._params = params;
        this._parse();
    }
    getRows() {
        return this._rows;
    }
    getCategories() {
        return [...new Set(this._rows.map(r => { var _a; return ((_a = r.category) === null || _a === void 0 ? void 0 : _a.raw) || ''; }))].filter(v => v !== '');
    }
    getAccounts() {
        return [...new Set([...this._rows.map(r => { var _a; return ((_a = r.account1) === null || _a === void 0 ? void 0 : _a.raw) || ''; }), ...this._rows.map(r => { var _a; return ((_a = r.account2) === null || _a === void 0 ? void 0 : _a.raw) || ''; })])].filter(v => v !== '');
    }
    getCurrencies() {
        return [...new Set([...this._rows.map(r => { var _a; return ((_a = r.currency1) === null || _a === void 0 ? void 0 : _a.raw) || ''; }), ...this._rows.map(r => { var _a; return ((_a = r.currency2) === null || _a === void 0 ? void 0 : _a.raw) || ''; })])].filter(v => v !== '');
    }
}
exports.Parser = Parser;
//# sourceMappingURL=parser.js.map