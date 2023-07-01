import { UpdateCurrencyRatesUseCase } from '../use-cases/update-currency-rates'
import { CurrencyRatesStorage} from '../storage/currency_rates'
import { ApiLayerCurrencyRatesImporter } from '../services/currency_rates/apilayer'
import { connectDatabase } from '../storage/connect'
import { createLogger } from '../utils/logger'
import { getConfig } from '../utils/config'

export const updateCurrencyRates = async (): Promise<object> => {
  const logger = createLogger()
  const config = getConfig()
  const db = connectDatabase(config.database(), logger)
  const currencyRatesStorage = new CurrencyRatesStorage(db, logger)
  const currencyRatesImporter = new ApiLayerCurrencyRatesImporter({
    apiKey: config.apilayer().token,
    baseUrl: config.apilayer().url,
  })

  const useCase = new UpdateCurrencyRatesUseCase(
    currencyRatesStorage,
    currencyRatesImporter,
    logger
  )

  await useCase.do({ date: new Date() })

  return {}
}
