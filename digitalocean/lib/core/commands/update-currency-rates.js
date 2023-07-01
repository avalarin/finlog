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
exports.updateCurrencyRates = void 0;
const update_currency_rates_1 = require("../use-cases/update-currency-rates");
const currency_rates_1 = require("../storage/currency_rates");
const apilayer_1 = require("../services/currency_rates/apilayer");
const connect_1 = require("../storage/connect");
const logger_1 = require("../utils/logger");
const config_1 = require("../utils/config");
const updateCurrencyRates = () => __awaiter(void 0, void 0, void 0, function* () {
    const logger = (0, logger_1.createLogger)();
    const config = (0, config_1.getConfig)();
    const db = (0, connect_1.connectDatabase)(config.database(), logger);
    const currencyRatesStorage = new currency_rates_1.CurrencyRatesStorage(db, logger);
    const currencyRatesImporter = new apilayer_1.ApiLayerCurrencyRatesImporter({
        apiKey: config.apilayer().token,
        baseUrl: config.apilayer().url,
    });
    const useCase = new update_currency_rates_1.UpdateCurrencyRatesUseCase(currencyRatesStorage, currencyRatesImporter, logger);
    yield useCase.do({ date: new Date() });
    return {};
});
exports.updateCurrencyRates = updateCurrencyRates;
//# sourceMappingURL=update-currency-rates.js.map