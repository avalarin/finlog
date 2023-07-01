import fetch, { RequestRedirect } from 'node-fetch'

import { CurrencyRatesImporter, CurrencyRatesResponse } from './interface'
import Decimal from 'decimal.js'

export interface ApiLayerCurrencyRatesImporterConfig {
  apiKey: string,
  baseUrl: string
}

interface ApiLayerRates {
  [currency: string]: number
}

interface ApiLayerResponse {
  success: boolean
  source: string
  rates: ApiLayerRates | { [date: string]: ApiLayerRates }
}

export class ApiLayerCurrencyRatesImporter implements CurrencyRatesImporter {
  constructor(private _config: ApiLayerCurrencyRatesImporterConfig) {
  }

  async fetchRates(base: string, currencies: string[], date?: Date): Promise<CurrencyRatesResponse> {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow' as RequestRedirect,
      headers: {
        'apikey': this._config.apiKey
      }
    }

    const baseRequest = `base=${base}&symbols=${currencies.join(',')}`
    const dateStr = date ? date.toISOString().substring(0,10) : undefined

    const requestPath = dateStr ?
      `/timeseries?start_date=${dateStr}&end_date=${dateStr}&${baseRequest}` :
      `/latest?${baseRequest}`

    const request = this._config.baseUrl + requestPath
    console.log('Sending request ' + request)
    
    const response = await fetch(request, requestOptions)
      .then(response => response.json())
      .catch(error => { 
        console.error('Unable to fetch currencies', error)
        return Promise.reject(error)
      }) as ApiLayerResponse

    if (!response.success) {
      console.error('Unable to fetch currencies: api returned error')
      throw new Error('unable to fetch currencies')
    }
    
    const rates = (dateStr ? response.rates[dateStr] : response.rates) as { [currency: string]: number }
    const decimalRates = Object.keys(rates).reduce((acc, currency) => {
      return { ...acc, [currency]: new Decimal(rates[currency]) }
    }, {} as { [currency: string]: Decimal })

    return {
      base,
      rates: decimalRates
    }
  }

}
