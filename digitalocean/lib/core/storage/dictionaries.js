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
exports.DictionariesStorage = void 0;
const selectCurrenciesQuery = 'select code, name, flag from currencies';
const selectCategoriesQuery = 'select id, name, description from operation_categories';
const selectAccountsQuery = 'select acc.id, acc.name, acc.currency, acc.comment, acc.created_at, ' +
    'u.id user_id, u.name user_name, u.full_name user_full_name, ' +
    'cat.code category_code, cat.name category_name, cat.description category_description, ' +
    'cnt.id country_id, cnt.name country_name, cnt.flag country_flag ' +
    'from accounts acc ' +
    'join users u on u.id = acc.owner_id ' +
    'join countries cnt on cnt.id = acc.country_id ' +
    'join account_categories cat on cat.code = acc.category ' +
    'where owner_id = $1';
class DictionariesStorage {
    constructor(_database, _logger) {
        this._database = _database;
        this._logger = _logger;
    }
    getAccounts(onwerId) {
        return __awaiter(this, void 0, void 0, function* () {
            this._logger.info(`Getting accounts for user ${onwerId} from db`);
            try {
                const accounts = yield this._database.manyOrNone(selectAccountsQuery, [onwerId]);
                this._logger.info(`Found ${accounts.length} accounts`);
                return accounts.map(r => ({
                    id: r.id,
                    name: r.name,
                    currency: r.currency,
                    comment: r.comment,
                    createdAt: r.created_at,
                    owner: {
                        id: r.user_id,
                        name: r.user_name,
                        fullName: r.user_full_name,
                    },
                    category: {
                        code: r.category_code,
                        name: r.category_name,
                        description: r.category_description,
                    },
                    country: {
                        id: r.country_id,
                        name: r.country_name,
                        flag: r.country_flag,
                    }
                }));
            }
            catch (e) {
                this._logger.error('Unable to get accounts', e);
                throw e;
            }
        });
    }
    getCategories(onwerId) {
        return __awaiter(this, void 0, void 0, function* () {
            this._logger.info(`Getting categories for user ${onwerId} from db`);
            try {
                const categories = yield this._database.manyOrNone(selectCategoriesQuery, [onwerId]);
                this._logger.info(`Found ${categories.length} categories`);
                return categories.map(r => ({
                    id: r.id,
                    name: r.name,
                    description: r.description,
                }));
            }
            catch (e) {
                this._logger.error('Unable to get categories', e);
                throw e;
            }
        });
    }
    getCurrencies(onwerId) {
        return __awaiter(this, void 0, void 0, function* () {
            this._logger.info(`Getting currencies for user ${onwerId} from db`);
            try {
                const currencies = yield this._database.manyOrNone(selectCurrenciesQuery, [onwerId]);
                this._logger.info(`Found ${currencies.length} currencies`);
                return currencies.map(r => ({
                    code: r.code,
                    name: r.name,
                    flag: r.flag,
                }));
            }
            catch (e) {
                this._logger.error('Unable to get curreancies', e);
                throw e;
            }
        });
    }
}
exports.DictionariesStorage = DictionariesStorage;
//# sourceMappingURL=dictionaries.js.map