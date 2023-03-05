import { IDatabase } from 'pg-promise'
import {Logger} from '../utils/logger'

const selectUploadQuery = 'select id, owner_id, date, status, type, params, ' +
                          '(select count(*) from upload_contents where upload_id = $1) as rows_count ' +
                          'from uploads where id = $1 and owner_id = $2'
const insertUploadQuery = 'insert into uploads (owner_id, params) values ($1, $2) returning id'
const insertUploadRowQuery = 'insert into upload_contents (upload_id, row_index, row_data) values ($1, $2, $3)'
const updateUploadStatusQuery = 'update uploads set status = $3 where id = $1 and owner_id = $2 returning id'
const updateUploadParamsQuery = 'update uploads set params = $3 where id = $1 and owner_id = $2 returning id'

export type UploadStatus = 'new' | 'completed' | 'cancelled'

export interface UploadParams {
    rowDelimiter?: string,
    fieldDelimiter?: string
}

export interface UploadId {
    id: number,
    ownerId: number
}

export interface Upload extends UploadId {
    date: Date,
    status: UploadStatus,
    params: UploadParams,
    rowsCount: number
}

export interface IUploadsStorage {
  getUpload(id: number, ownerId: number): Promise<Upload>
  createUpload(ownerId: number, rows: string[][], params: UploadParams): Promise<UploadId>
  updateUploadStatus(id: number, ownerId: number, status: UploadStatus): void
  updateUploadParams(id: number, ownerId: number, params: UploadParams): void
}

export class UploadsStorage implements IUploadsStorage {
  private _database: IDatabase<unknown>
  private _logger: Logger

  constructor(database: IDatabase<unknown>, logger: Logger) {
    this._database = database
    this._logger = logger
  }

  async getUpload(id: number, ownerId: number): Promise<Upload> {
    this._logger.info(`Getting upload ${id}, owner=${ownerId} from db`)

    try {
      const upload = await this._database.one(selectUploadQuery, [id, ownerId], r => ({
        id: r.id,
        ownerId: r.owner_id,
        date: r.date,
        status: r.status,
        type: r.type,
        params: r.params,
        rowsCount: +r.rows_count
      }))
      this._logger.info(`Found upload ${id} with ${upload.rowsCount}`)
      return upload
    } catch (e) {
      this._logger.error(`Unable to find upload ${id}, owner=${ownerId}`, e)
      throw e
    }
  }

  async createUpload(ownerId: number, rows: string[][], params: UploadParams): Promise<UploadId> {
    this._logger.info(`Creating upload with owner=${ownerId} and ${rows.length} rows`)

    try {
      const result = await this._database.tx(async t => {
        const uploadId = await t.one(insertUploadQuery, [ownerId, JSON.stringify(params)], r => r.id)
        console.log('Inserted upload with ID:', uploadId)
      
        await Promise.all(rows.map((data, index) => {
          return t.none(insertUploadRowQuery, [ uploadId, index, JSON.stringify(data) ])
        }))
      
        console.log(`Inserted ${rows.length} rows`)
      
        return {
          id: uploadId,
          ownerId: ownerId
        }
      })

      this._logger.info(`Upload ${result.id} created`)

      return result
    } catch (e) {
      this._logger.error('Unable to create upload', e)
      throw e
    }
  }

  async updateUploadStatus(id: number, ownerId: number, status: UploadStatus) {
    this._logger.info(`Updating status of upload with ${id}, owner=${ownerId} to ${status}`)

    try {
      const updatedId = await this._database.one(updateUploadStatusQuery, [id, ownerId, status], r => r.id)
      if (!updatedId) {
        throw new Error(`upload ${id} doesn't exist`)
      }
      this._logger.info(`Upload ${id} updated`)
    } catch (e) {
      this._logger.error('Unable to update upload', e)
      throw e
    }
  }

  async updateUploadParams(id: number, ownerId: number, params: UploadParams) {
    this._logger.info(`Updating params of upload with ${id}, owner=${ownerId} to ${JSON.stringify(params)}`)

    try {
      const updatedId = await this._database.one(updateUploadParamsQuery, [id, ownerId, JSON.stringify(params)], r => r.id)
      if (!updatedId) {
        throw new Error(`upload ${id} doesn't exist`)
      }
      this._logger.info(`Upload ${id} updated`)
    } catch (e) {
      this._logger.error('Unable to update upload', e)
      throw e
    }
  }
}
