"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const node_fetch_1 = __importStar(require("node-fetch"));
const apilayer_1 = require("./apilayer");
jest.mock('node-fetch', () => (Object.assign(Object.assign({}, jest.requireActual('node-fetch')), { fetch: jest.fn() })));
const mockedFetch = node_fetch_1.default;
function jsonResponse(obj) {
    return new node_fetch_1.Response(JSON.stringify(obj), {});
}
describe('ApiLayerCurrencyRatesImporter', () => {
    const config = {
        apiKey: 'test_api_key',
        baseUrl: 'https://api.apilayer.com/exchangerates_data',
    };
    const importer = new apilayer_1.ApiLayerCurrencyRatesImporter(config);
    describe('fetchRates', () => {
        it('should fetch currency rates for a specific date', () => __awaiter(void 0, void 0, void 0, function* () {
            const base = 'USD';
            const currencies = ['EUR', 'JPY'];
            const date = new Date('2022-01-01');
            const expectedRequest = `${config.baseUrl}/timeseries?start_date=2022-01-01&end_date=2022-01-01&base=USD&symbols=EUR,JPY`;
            // Mock the fetch method to return the expected response
            new node_fetch_1.Response();
            mockedFetch.mockResolvedValueOnce(jsonResponse({
                success: true,
                source: base,
                rates: {
                    '2022-01-01': {
                        EUR: 0.8,
                        JPY: 110,
                    },
                },
            }));
            const response = yield importer.fetchRates(base, currencies, date);
            // Verify that the fetch method was called with the expected request URL and headers
            expect(node_fetch_1.default).toHaveBeenCalledWith(expectedRequest, {
                method: 'GET',
                redirect: 'follow',
                headers: {
                    apikey: config.apiKey,
                },
            });
            // Verify that the response contains the expected data
            expect(response.base).toBe(base);
            expect(response.rates.EUR.toNumber()).toBe(0.8);
            expect(response.rates.JPY.toNumber()).toBe(110);
        }));
        it('should fetch the latest currency rates', () => __awaiter(void 0, void 0, void 0, function* () {
            const base = 'USD';
            const currencies = ['EUR', 'JPY'];
            const date = undefined;
            const expectedRequest = `${config.baseUrl}/latest?base=USD&symbols=EUR,JPY`;
            // Mock the fetch method to return the expected response
            mockedFetch.mockResolvedValueOnce(jsonResponse({
                success: true,
                source: base,
                rates: {
                    EUR: 0.9,
                    JPY: 120,
                },
            }));
            const response = yield importer.fetchRates(base, currencies, date);
            // Verify that the fetch method was called with the expected request URL and headers
            expect(node_fetch_1.default).toHaveBeenCalledWith(expectedRequest, {
                method: 'GET',
                redirect: 'follow',
                headers: {
                    apikey: config.apiKey,
                },
            });
            // Verify that the response contains the expected data
            expect(response.base).toBe(base);
            expect(response.rates.EUR.toNumber()).toBe(0.9);
            expect(response.rates.JPY.toNumber()).toBe(120);
        }));
        it('should throw an error if the API returns an error', () => __awaiter(void 0, void 0, void 0, function* () {
            const base = 'USD';
            const currencies = ['EUR', 'JPY'];
            const date = new Date('2022-01-01');
            // Mock the fetch method to return an error response
            mockedFetch.mockResolvedValueOnce(jsonResponse({
                success: false,
            }));
            // Verify that the fetch method throws an error
            yield expect(importer.fetchRates(base, currencies, date)).rejects.toThrowError('unable to fetch currencies');
            // Verify that the fetch method was called with the expected request URL and headers
            const expectedRequest = `${config.baseUrl}/timeseries?start_date=2022-01-01&end_date=2022-01-01&base=USD&symbols=EUR,JPY`;
            expect(node_fetch_1.default).toHaveBeenCalledWith(expectedRequest, {
                method: 'GET',
                redirect: 'follow',
                headers: {
                    apikey: config.apiKey,
                },
            });
        }));
        it('should throw an error if the fetch method fails', () => __awaiter(void 0, void 0, void 0, function* () {
            const base = 'USD';
            const currencies = ['EUR', 'JPY'];
            const date = new Date('2022-01-01');
            // Mock the fetch method to return a rejected promise
            mockedFetch.mockImplementation(() => Promise.reject(new Error('fetch error')));
            // Verify that the fetch method throws an error
            yield expect(importer.fetchRates(base, currencies, date)).rejects.toThrowError('fetch error');
            // Verify that the fetch method was called with the expected request URL and headers
            const expectedRequest = `${config.baseUrl}/timeseries?start_date=2022-01-01&end_date=2022-01-01&base=USD&symbols=EUR,JPY`;
            expect(node_fetch_1.default).toHaveBeenCalledWith(expectedRequest, {
                method: 'GET',
                redirect: 'follow',
                headers: {
                    apikey: config.apiKey,
                },
            });
        }));
    });
});
//# sourceMappingURL=apilayer.test.js.map