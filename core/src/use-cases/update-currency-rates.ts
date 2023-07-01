import { IUseCase } from './interface'
import { CurrencyRatesStorage } from '../storage/currency_rates.js'
import { ApiLayerCurrencyRatesImporter } from '../services/currency_rates/apilayer.js'
import { Logger } from '../utils/logger'

interface CurrencyRatesRequest {
  date: Date
}

interface CurrencyRatesResult {
  result: boolean
}

export class UpdateCurrencyRatesUseCase implements IUseCase<CurrencyRatesRequest, CurrencyRatesResult> {
  constructor(
    private _currencyRatesStorage: CurrencyRatesStorage,
    private _currencyRatesImporter: ApiLayerCurrencyRatesImporter,
    private _logger: Logger
  ) {}

  async do(req: CurrencyRatesRequest): Promise<CurrencyRatesResult> {
    const currencies = await this._currencyRatesStorage.getUniqueCurrencies()

    this._logger.info(`Updating currency rates for ${currencies} on ${req.date}`)

    currencies.forEach(async base => {
      const target = currencies.filter(currency => currency !== base)
      const currencyRates = await this._currencyRatesImporter.fetchRates(base, target, req.date)
      this._logger.debug(`Fetched currency rates for ${base} on ${req.date}`)
    
      await Promise.all(Object.keys(currencyRates.rates).map(currency => {
        this._currencyRatesStorage.addRate({
          from: currencyRates.base,
          to: currency,
          rateDate: req.date,
          rate: currencyRates.rates[currency]
        })
      }))
    })

    return { result: true }
  }
}
