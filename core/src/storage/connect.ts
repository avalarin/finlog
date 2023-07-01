import pgPromise, { IDatabase } from 'pg-promise'
import { Logger } from '../utils/logger'
import { IDatabaseConfig } from '../utils/config'

const pgp = pgPromise({})

export const connectDatabase = (config: IDatabaseConfig, logger: Logger): IDatabase<unknown> => {
  const pgOptions = {
    host: config.host,
    port: config.port,
    database: config.database,
    user: config.user,
    password: config.password,
    options: `-c search_path=${config.schema}`,
    ssl: {
      rejectUnauthorized: true,
      ca: config.sslCA,
    }
  }
  logger.info(`Connecting to postgresql ${pgOptions.host}:${pgOptions.port}/${pgOptions.database}...`)
  return pgp(pgOptions) as IDatabase<unknown>
}
