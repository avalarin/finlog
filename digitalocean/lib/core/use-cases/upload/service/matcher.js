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
exports.AIDataMatcher = exports.StorageValuesProvider = void 0;
const openai_1 = require("openai");
const parser_1 = require("./parser");
class StorageValuesProvider {
    constructor(_storage) {
        this._storage = _storage;
    }
    getCategories(ownerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._storage.getCategories(ownerId);
        });
    }
    getCurrencies(ownerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._storage.getCurrencies(ownerId))
                .map(c => ({ id: c.code, name: c.name }));
        });
    }
    getAccounts(ownerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._storage.getAccounts(ownerId);
        });
    }
}
exports.StorageValuesProvider = StorageValuesProvider;
class AIDataMatcher {
    constructor(_valuesProvider, _logger) {
        this._valuesProvider = _valuesProvider;
        this._logger = _logger;
        this._openai = new openai_1.OpenAIApi(new openai_1.Configuration({
            apiKey: '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'
        }));
    }
    match(userId, contentString, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const finalParams = Object.assign({}, params);
            if (!finalParams.fieldDelimiter) {
                finalParams.fieldDelimiter = yield this.askForFieldDelimiter(contentString, finalParams.rowDelimiter);
            }
            if (!finalParams.rowDelimiter) {
                finalParams.rowDelimiter = yield this.askForRowDelimiter(contentString, finalParams.fieldDelimiter);
            }
            const parser = new parser_1.Parser(contentString, finalParams);
            const accounts = yield this._valuesProvider.getAccounts(userId);
            const categories = yield this._valuesProvider.getCategories(userId);
            const currencies = yield this._valuesProvider.getCurrencies(userId);
            if (!finalParams.fields) {
                const rows = parser.getRows().map(r => r.fields);
                finalParams.fields = yield this.detectFieldTypes(rows, categories, accounts, currencies);
            }
            parser.setParams(finalParams);
            if (!finalParams.accountMapping) {
                finalParams.accountMapping = yield this.askForMapping(parser.getAccounts(), accounts, parseInt);
            }
            if (!finalParams.categoryMapping) {
                finalParams.categoryMapping = yield this.askForMapping(parser.getCategories(), categories, parseInt);
            }
            if (!finalParams.currencyMapping) {
                finalParams.currencyMapping = yield this.askForMapping(parser.getCurrencies(), currencies, s => s);
            }
            parser.setParams(finalParams);
            return {
                params: finalParams
            };
        });
    }
    askForRowDelimiter(contentString, fieldDelimiter) {
        return __awaiter(this, void 0, void 0, function* () {
            const question = formatQuestion(fieldDelimiter ? `The field delimiter is ${formatSingleLine(fieldDelimiter)}.` : null, 'What is the row delimiter in the following text?', formatRawData(contentString));
            return (yield this.ask(question)).replace(/\\n/g, '\n').replace(/\\t/g, '\t');
        });
    }
    askForFieldDelimiter(contentString, rowDelimiter) {
        return __awaiter(this, void 0, void 0, function* () {
            const question = formatQuestion(rowDelimiter ? `The row delimiter is ${formatSingleLine(rowDelimiter)}.` : null, 'What is the field delimiter in the following text?', formatRawData(contentString));
            return (yield this.ask(question)).replace(/\\n/g, '\n').replace(/\\t/g, '\t');
        });
    }
    detectFieldTypes(rows, categories, accounts, currencies) {
        return __awaiter(this, void 0, void 0, function* () {
            const fieldTypes = (yield this.askForFieldTypes(rows[0], categories, accounts, currencies))
                .map((type, order) => ({ order, type }));
            const requiredTypes = ['date', 'category', 'comment', 'account1', 'amount1', 'currency1', 'exchangeRate1'];
            const secondTypes = ['account2', 'amount2', 'currency2', 'exchangeRate2'];
            const foundTypes = new Set(fieldTypes.map(f => f.type));
            if (secondTypes.some(t => foundTypes.has(t))) {
                requiredTypes.push(...secondTypes);
            }
            requiredTypes.forEach(type => {
                if (foundTypes.has(type))
                    return;
                fieldTypes.push({ order: undefined, type, defaultValue: undefined });
            });
            return fieldTypes;
        });
    }
    askForFieldTypes(row, categories, accounts, currencies) {
        return __awaiter(this, void 0, void 0, function* () {
            categories = categories.slice(0, 3);
            accounts = accounts.slice(0, 3);
            currencies = currencies.slice(0, 3);
            const question = formatQuestion('There may be folowing types:', '- date: Date in various formats', '- comment: User given comment', '- category: Category of the operation, like ' + categories.map(c => '"' + c.name + '"').join(', ') + ';', '- account1: Account of the operation, like ' + accounts.map(c => '"' + c.name + '"').join(', ') + ';', '- amount1: Amount of the operation in various formats;', '- currency1: Currency of the operation like ' + currencies.map(c => '"' + c.name + '"').join(', ') + ';', '- echangeRate1: Echange rate between the presented curreancy and the currency of the account, by default 1.', 'Fields account, amount, currency and echangeRate may be presented twice, in this case name it like "account1" and "account2".', '', 'Which fields are presented in the following text in which order? Provide only field names, one name per line.', formatMultiline(row.join('\t')));
            return (yield this.ask(question)).split('\n');
        });
    }
    askForMapping(sourceValues, providedValues, parse) {
        return __awaiter(this, void 0, void 0, function* () {
            const question = formatQuestion('There is a list A, with keys and values stored in the database:', formatMultiline(providedValues.map(v => `${v.id}: "${v.name}"`).join('\n')), '', 'There is a list B, with user given values:', formatMultiline([...new Set(sourceValues)].map(v => `"${v}"`).join('\n')), '', 'Match values from two lists, provide JSON with values from the list A and kyes from the list B.');
            return Object.fromEntries(Object.entries(JSON.parse(yield this.ask(question)))
                .map(([k, v]) => [k, parse(v)]));
        });
    }
    ask(question) {
        return __awaiter(this, void 0, void 0, function* () {
            this._logger.info(`Asking AI: ${question}`);
            const completions = yield this._openai.createCompletion({
                model: 'text-davinci-003',
                prompt: question,
                temperature: 0,
                max_tokens: 500,
            });
            this._logger.info(`AI raw answer: ${completions.data.choices[0].text}`);
            const answer = parseAnswer(completions.data.choices[0].text || '');
            this._logger.info(`AI answer: ${answer}`);
            if (!answer) {
                throw new Error('AI didn\'t answer correctly');
            }
            return answer;
        });
    }
}
exports.AIDataMatcher = AIDataMatcher;
const parseAnswer = (answer) => {
    const match = answer.match(/(?:(?:[^`]|^)`|```\w*)([^`]+)(?:`(?:[^`]|$)|```)/);
    return (match ? match[1] : answer).trim();
};
const formatQuestion = (...lines) => 'I want you to only reply with the output inside' +
    'one unique code block, and nothing else. ' +
    'Don\'t write explanations. Don\'t not type commands.' +
    '\n\n' + lines.filter(l => l !== null).join('\n');
const formatSingleLine = (code) => '`' + code.replace(/\n/g, '\\n').replace(/\t/g, '\\t') + '`';
const formatRawData = (data) => '```\n' + data.replace(/\n/g, '\\n').replace(/\t/g, '\\t') + '\n```';
const formatMultiline = (data) => '```\n' + data + '\n```';
//# sourceMappingURL=matcher.js.map