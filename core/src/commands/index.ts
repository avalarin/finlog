import { createLogger } from '../utils/logger'
import { CommandError } from '../utils/error'

import {updateCurrencyRates} from './update-currency-rates'

type CommandFunction = (req: object) => Promise<object>

const commands: {[key: string]: CommandFunction} = {
  'update-currency-rates': updateCurrencyRates
}

export const callCommand = async (command: string, req: object) => {
  const logger = createLogger()
  const cmd = commands[command]
  if (!cmd) {
    logger.warn(`Unable to find command ${command}`)
    return {
      body: {
        status: 'not-found',
        error: 'unknown command'
      }
    }
  }

  try {
    const result = await cmd(req)
    return {
      body: {
        status: 'ok',
        result
      }
    }
  } catch(err) {
    if (err instanceof CommandError) {
      return {
        body: {
          status: 'error',
          error: err.userMessage
        }
      }
    }
  
    logger.error(`Command ${command} failed`, err)
    return {
      body: {
        status: 'error',
        error: 'unexpected server error'
      }
    }
  }
}
