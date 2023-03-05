import pgPromise, { IDatabase } from 'pg-promise'
import {Logger} from '../utils/logger'

const pgp = pgPromise({})

export const connectDatabase = (logger: Logger): IDatabase<unknown> => {
  const pgOptions = {
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    options: `-c search_path=${process.env.POSTGRES_SCHEMA}`,
    ssl: {
            
      rejectUnauthorized: true,
      ca: process.env.POSTGRES_SSL_CA?.replace(/\\n/g, '\n', ) || '',
    }
  }
  logger.info(`Connecting to postgresql ${pgOptions.host}:${pgOptions.port}/${pgOptions.database}...`)
  return pgp(pgOptions) as IDatabase<unknown>
}
