import 'dotenv/config'

export interface IDatabaseConfig {
  host: string,
  port: number,
  database: string,
  user: string,
  password: string,
  schema: string,
  sslCA: string,
}

export interface IApiEndpointConfig {
  url: string
  token: string
}

interface IConfig {
  database(): IDatabaseConfig

  apilayer(): IApiEndpointConfig
}

export const getConfig = () => {
  return {
    database: () => ({
      host: process.env.POSTGRES_HOST as string,
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
      database: process.env.POSTGRES_DB as string,
      user: process.env.POSTGRES_USER as string,
      password: process.env.POSTGRES_PASSWORD as string,
      schema:process.env.POSTGRES_SCHEMA as string,
      sslCA: process.env.POSTGRES_SSL_CA?.replace(/\\n/g, '\n', ) || ''
    }),
    apilayer: () => ({
      url: process.env.APILAYER_URL as string,
      token: process.env.APILAYER_TOKEN as string
    })
  } as IConfig
}
