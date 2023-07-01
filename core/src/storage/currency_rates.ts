import { IDatabase } from 'pg-promise'
import { Logger } from '../utils/logger'

import Decimal from 'decimal.js'

const selectUniqueCurrenciesQuery = 'select distinct from_currency from currency_rates union select distinct to_currency from currency_rates'
const selectRateQuery = 'select * from currency_rates where from_currency = $1 and to_currency = $2 and date <= $3 order by date desc limit 1'
const insertRateQuery = 'insert into currency_rates (from_currency, to_currency, date, value, source) values ($1, $2, $3, $4, $5)'

export interface CurrencyRate {
  from: string,
  to: string,
  rateDate: Date
  rate: Decimal
}

export interface AddRateReq {
  from: string,
  to: string,
  rateDate: Date
  rate: Decimal
}

export interface ICurrencyRatesStorage {
  findClosestRate(from: string, to: string, data: Date): Promise<CurrencyRate | undefined>
  addRate(req: AddRateReq): Promise<void>
}

export class CurrencyRatesStorage implements ICurrencyRatesStorage {
  constructor(
    private _database: IDatabase<unknown>,
    private _logger: Logger
  ) {}

  async getUniqueCurrencies(): Promise<string[]> {
    return this._database.map(selectUniqueCurrenciesQuery, [], r => r.from_currency)
  }

  async findClosestRate(from: string, to: string, date: Date): Promise<CurrencyRate | undefined> {
    this._logger.debug(`Looking for currency rate from ${from} to ${to} in ${date}`)

    const rate = await this._database.oneOrNone(selectRateQuery, [from, to, date], r => ({
      from: r.from_currency,
      to: r.to_currency,
      rateDate: r.date,
      rate: r.value,
    }))

    // If no rate found, return null
    if (!rate) {
      this._logger.warn('Unable to find currancy rate')
      return undefined
    }

    this._logger.debug(`Currency rate found ${rate}`)
    return rate
  }

  async addRate(req: AddRateReq): Promise<void> {
    const values = [req.from, req.to, req.rateDate, req.rate.toString(), '']
    try {
      await this._database.none(insertRateQuery, values)
      this._logger.debug(`Added currency rate: ${req.from}/${req.to}=${req.rate}`)
    } catch (error) {
      this._logger.error('Error adding currency rate', error)
      throw error
    }
  }
}
