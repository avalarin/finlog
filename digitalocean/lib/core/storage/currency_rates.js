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
exports.CurrencyRatesStorage = void 0;
const selectUniqueCurrenciesQuery = 'select distinct from_currency from currency_rates union select distinct to_currency from currency_rates';
const selectRateQuery = 'select * from currency_rates where from_currency = $1 and to_currency = $2 and date <= $3 order by date desc limit 1';
const insertRateQuery = 'insert into currency_rates (from_currency, to_currency, date, value, source) values ($1, $2, $3, $4, $5)';
class CurrencyRatesStorage {
    constructor(_database, _logger) {
        this._database = _database;
        this._logger = _logger;
    }
    getUniqueCurrencies() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._database.map(selectUniqueCurrenciesQuery, [], r => r.from_currency);
        });
    }
    findClosestRate(from, to, date) {
        return __awaiter(this, void 0, void 0, function* () {
            this._logger.debug(`Looking for currency rate from ${from} to ${to} in ${date}`);
            const rate = yield this._database.oneOrNone(selectRateQuery, [from, to, date], r => ({
                from: r.from_currency,
                to: r.to_currency,
                rateDate: r.date,
                rate: r.value,
            }));
            // If no rate found, return null
            if (!rate) {
                this._logger.warn('Unable to find currancy rate');
                return undefined;
            }
            this._logger.debug(`Currency rate found ${rate}`);
            return rate;
        });
    }
    addRate(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const values = [req.from, req.to, req.rateDate, req.rate.toString(), ''];
            try {
                yield this._database.none(insertRateQuery, values);
                this._logger.debug(`Added currency rate: ${req.from}/${req.to}=${req.rate}`);
            }
            catch (error) {
                this._logger.error('Error adding currency rate', error);
                throw error;
            }
        });
    }
}
exports.CurrencyRatesStorage = CurrencyRatesStorage;
//# sourceMappingURL=currency_rates.js.map