import Decimal from 'decimal.js'

export interface CurrencyRatesResponse {
  base: string,
  rates: {
    [currency: string]: Decimal
  }
}

export interface CurrencyRatesImporter {
  fetchRates(base: string, currencies: string[], date?: Date): Promise<CurrencyRatesResponse>
}
