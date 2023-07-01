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
exports.UpdateCurrencyRatesUseCase = void 0;
class UpdateCurrencyRatesUseCase {
    constructor(_currencyRatesStorage, _currencyRatesImporter, _logger) {
        this._currencyRatesStorage = _currencyRatesStorage;
        this._currencyRatesImporter = _currencyRatesImporter;
        this._logger = _logger;
    }
    do(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const currencies = yield this._currencyRatesStorage.getUniqueCurrencies();
            this._logger.info(`Updating currency rates for ${currencies} on ${req.date}`);
            currencies.forEach((base) => __awaiter(this, void 0, void 0, function* () {
                const target = currencies.filter(currency => currency !== base);
                const currencyRates = yield this._currencyRatesImporter.fetchRates(base, target, req.date);
                this._logger.debug(`Fetched currency rates for ${base} on ${req.date}`);
                yield Promise.all(Object.keys(currencyRates.rates).map(currency => {
                    this._currencyRatesStorage.addRate({
                        from: currencyRates.base,
                        to: currency,
                        rateDate: req.date,
                        rate: currencyRates.rates[currency]
                    });
                }));
            }));
            return { result: true };
        });
    }
}
exports.UpdateCurrencyRatesUseCase = UpdateCurrencyRatesUseCase;
//# sourceMappingURL=update-currency-rates.js.map