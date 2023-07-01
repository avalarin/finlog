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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiLayerCurrencyRatesImporter = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const decimal_js_1 = __importDefault(require("decimal.js"));
class ApiLayerCurrencyRatesImporter {
    constructor(_config) {
        this._config = _config;
    }
    fetchRates(base, currencies, date) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestOptions = {
                method: 'GET',
                redirect: 'follow',
                headers: {
                    'apikey': this._config.apiKey
                }
            };
            const baseRequest = `base=${base}&symbols=${currencies.join(',')}`;
            const dateStr = date ? date.toISOString().substring(0, 10) : undefined;
            const requestPath = dateStr ?
                `/timeseries?start_date=${dateStr}&end_date=${dateStr}&${baseRequest}` :
                `/latest?${baseRequest}`;
            const request = this._config.baseUrl + requestPath;
            console.log('Sending request ' + request);
            const response = yield (0, node_fetch_1.default)(request, requestOptions)
                .then(response => response.json())
                .catch(error => {
                console.error('Unable to fetch currencies', error);
                return Promise.reject(error);
            });
            if (!response.success) {
                console.error('Unable to fetch currencies: api returned error');
                throw new Error('unable to fetch currencies');
            }
            const rates = (dateStr ? response.rates[dateStr] : response.rates);
            const decimalRates = Object.keys(rates).reduce((acc, currency) => {
                return Object.assign(Object.assign({}, acc), { [currency]: new decimal_js_1.default(rates[currency]) });
            }, {});
            return {
                base,
                rates: decimalRates
            };
        });
    }
}
exports.ApiLayerCurrencyRatesImporter = ApiLayerCurrencyRatesImporter;
//# sourceMappingURL=apilayer.js.map