import pgPromise from 'pg-promise'
import { IDatabase } from 'pg-promise'
import { UploadsStorage } from './uploads'
import { createLogger } from '../utils/logger'

const pgp = pgPromise()

describe('Storage', () => {
  let db: IDatabase<unknown>
  let storage: UploadsStorage

  beforeAll(async () => {
    db = pgp('postgresql://testuser:testpassword@localhost:5432/testdb')
    await db.query('insert into users (id, name, full_name) values (1, \'test\', \'test\') on conflict do nothing')

    storage = new UploadsStorage(db, createLogger())
  })

  afterAll(async () => {
    await db.$pool.end()
  })

  describe('createUpload', () => {
    it('should insert an upload and its rows', async () => {
      // arrange
      const ownerId = 1
      const rows = [['r1col1', 'r1col2'], ['r2col1', 'r2col2'], ['r3col1', 'r3col2']]

      // act
      const { id: uploadId } = await storage.createUpload(ownerId, rows, { rowDelimiter: 'x' })

      // assert
      const result1 = await db.result<{params: unknown}>('SELECT * FROM uploads WHERE id = $1', [uploadId])
      expect(result1.rows).toHaveLength(1)
      expect(result1.rows[0].params).toEqual({ rowDelimiter: 'x' })

      const result2 = await db.result<{row_data:string[]}>('SELECT * FROM upload_contents WHERE upload_id = $1', [uploadId])
      expect(result2.rows).toHaveLength(3)

      expect(result2.rows[0].row_data).toHaveLength(2)
      expect(result2.rows[0].row_data[0]).toBe(rows[0][0])
      expect(result2.rows[1].row_data).toHaveLength(2)
      expect(result2.rows[1].row_data[1]).toBe(rows[1][1])
      expect(result2.rows[2].row_data).toHaveLength(2)
      expect(result2.rows[2].row_data[0]).toBe(rows[2][0])
    })
  })

  describe('getUpload', () => {  
    it('should return the upload with the specified ID and owner ID', async () => {
      // arrange
      const uploadId = await db.one('INSERT INTO uploads (owner_id, date, status, type, params) VALUES ($2, $3, $4, $5, $6) RETURNING id',
        [1, 1, new Date(), 'new', 'operations', { param: 'value' }],
        r => r.id
      )
      await db.none('INSERT INTO upload_contents (upload_id, row_index, row_data) VALUES ($1, $2, $3)', [uploadId, 1, '[1]'])
      await db.none('INSERT INTO upload_contents (upload_id, row_index, row_data) VALUES ($1, $2, $3)', [uploadId, 1, '[1]'])
      await db.none('INSERT INTO upload_contents (upload_id, row_index, row_data) VALUES ($1, $2, $3)', [uploadId, 1, '[1]'])

      // act
      const upload = await storage.getUpload(uploadId, 1)
  
      // assert
      expect(upload).toEqual({
        id: uploadId,
        ownerId: 1,
        date: expect.any(Date),
        status: 'new',
        type: 'operations',
        params: { param: 'value' },
        rowsCount: 3,
      })
    })
  
    it('should throw an error if the upload does not exist', async () => {
      await expect(storage.getUpload(2, 1)).rejects.toThrowError()
    })
  
    it('should throw an error if the owner ID does not match', async () => {
      await expect(storage.getUpload(1, 2)).rejects.toThrowError()
    })
  })

  describe('updateUploadStatus', () => {
    it('should update the status of the upload with the specified ID and owner ID', async () => {
      // arrange
      const uploadId = await db.one('INSERT INTO uploads (owner_id, date, status, type, params) VALUES ($2, $3, $4, $5, $6) RETURNING id',
        [1, 1, new Date(), 'new', 'operations', { param: 'value' }],
        r => r.id
      )

      // act
      await storage.updateUploadStatus(uploadId, 1, 'completed')
  
      // assert
      const upload = await storage.getUpload(uploadId, 1)
      expect(upload.status).toEqual('completed')
    })
  
    it('should not update the status of an upload that does not exist', async () => {
      await expect(storage.updateUploadStatus(2, 1, 'completed')).rejects.toThrowError()
    })
  
    it('should not update the status of an upload that does not belong to the specified owner ID', async () => {
      await expect(storage.updateUploadStatus(1, 2, 'completed')).rejects.toThrowError()
    })
  })

  describe('updateUploadParams', () => {
    it('should update the params of the upload with the specified ID and owner ID', async () => {
      // arrange
      const uploadId = await db.one('INSERT INTO uploads (owner_id, date, status, type, params) VALUES ($2, $3, $4, $5, $6) RETURNING id',
        [1, 1, new Date(), 'new', 'operations', { fieldDelimiter: 'x' }],
        r => r.id
      )

      // act
      await storage.updateUploadParams(uploadId, 1, { fieldDelimiter: '1' })
  
      // assert
      const upload = await storage.getUpload(uploadId, 1)
      expect(upload.params).toEqual({ fieldDelimiter: '1' })
    })
  
    it('should not params the status of an upload that does not exist', async () => {
      await expect(storage.updateUploadParams(2, 1, { fieldDelimiter: '1' })).rejects.toThrowError()
    })
  
    it('should not params the status of an upload that does not belong to the specified owner ID', async () => {
      await expect(storage.updateUploadParams(1, 2, { fieldDelimiter: '1' })).rejects.toThrowError()
    })
  })
})
