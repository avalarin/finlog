import fetch, { Response } from 'node-fetch'

import { ApiLayerCurrencyRatesImporter } from './apilayer'

jest.mock('node-fetch', () => ({
  ...jest.requireActual('node-fetch'),
  fetch: jest.fn(),
}))
const mockedFetch = (fetch as jest.MockedFunction<typeof fetch>)

function jsonResponse<T>(obj: T) {
  return new Response(JSON.stringify(obj), {}) 
}

describe('ApiLayerCurrencyRatesImporter', () => {
  const config = {
    apiKey: 'test_api_key',
    baseUrl: 'https://api.apilayer.com/exchangerates_data',
  }
  const importer = new ApiLayerCurrencyRatesImporter(config)

  describe('fetchRates', () => {
    it('should fetch currency rates for a specific date', async () => {
      const base = 'USD'
      const currencies = ['EUR', 'JPY']
      const date = new Date('2022-01-01')

      const expectedRequest = `${config.baseUrl}/timeseries?start_date=2022-01-01&end_date=2022-01-01&base=USD&symbols=EUR,JPY`

      // Mock the fetch method to return the expected response
      new Response()
      mockedFetch.mockResolvedValueOnce(jsonResponse({
        success: true,
        source: base,
        rates: {
          '2022-01-01': {
            EUR: 0.8,
            JPY: 110,
          },
        },
      }))

      const response = await importer.fetchRates(base, currencies, date)

      // Verify that the fetch method was called with the expected request URL and headers
      expect(fetch).toHaveBeenCalledWith(expectedRequest, {
        method: 'GET',
        redirect: 'follow',
        headers: {
          apikey: config.apiKey,
        },
      })

      // Verify that the response contains the expected data
      expect(response.base).toBe(base)
      expect(response.rates.EUR.toNumber()).toBe(0.8)
      expect(response.rates.JPY.toNumber()).toBe(110)
    })

    it('should fetch the latest currency rates', async () => {
      const base = 'USD'
      const currencies = ['EUR', 'JPY']
      const date = undefined

      const expectedRequest = `${config.baseUrl}/latest?base=USD&symbols=EUR,JPY`

      // Mock the fetch method to return the expected response
      mockedFetch.mockResolvedValueOnce(jsonResponse({
        success: true,
        source: base,
        rates: {
          EUR: 0.9,
          JPY: 120,
        },
      }))

      const response = await importer.fetchRates(base, currencies, date)

      // Verify that the fetch method was called with the expected request URL and headers
      expect(fetch).toHaveBeenCalledWith(expectedRequest, {
        method: 'GET',
        redirect: 'follow',
        headers: {
          apikey: config.apiKey,
        },
      })

      // Verify that the response contains the expected data
      expect(response.base).toBe(base)
      expect(response.rates.EUR.toNumber()).toBe(0.9)
      expect(response.rates.JPY.toNumber()).toBe(120)
    })

    it('should throw an error if the API returns an error', async () => {
      const base = 'USD'
      const currencies = ['EUR', 'JPY']
      const date = new Date('2022-01-01')

      // Mock the fetch method to return an error response
      mockedFetch.mockResolvedValueOnce(jsonResponse({
        success: false,
      }))
    
      // Verify that the fetch method throws an error
      await expect(importer.fetchRates(base, currencies, date)).rejects.toThrowError('unable to fetch currencies')
    
      // Verify that the fetch method was called with the expected request URL and headers
      const expectedRequest = `${config.baseUrl}/timeseries?start_date=2022-01-01&end_date=2022-01-01&base=USD&symbols=EUR,JPY`
      expect(fetch).toHaveBeenCalledWith(expectedRequest, {
        method: 'GET',
        redirect: 'follow',
        headers: {
          apikey: config.apiKey,
        },
      })
    })
    
    it('should throw an error if the fetch method fails', async () => {
      const base = 'USD'
      const currencies = ['EUR', 'JPY']
      const date = new Date('2022-01-01')
    
      // Mock the fetch method to return a rejected promise
      mockedFetch.mockImplementation(() => Promise.reject(new Error('fetch error')))
    
      // Verify that the fetch method throws an error
      await expect(importer.fetchRates(base, currencies, date)).rejects.toThrowError('fetch error')
    
      // Verify that the fetch method was called with the expected request URL and headers
      const expectedRequest = `${config.baseUrl}/timeseries?start_date=2022-01-01&end_date=2022-01-01&base=USD&symbols=EUR,JPY`
      expect(fetch).toHaveBeenCalledWith(expectedRequest, {
        method: 'GET',
        redirect: 'follow',
        headers: {
          apikey: config.apiKey,
        },
      })
    })
  })
})    
