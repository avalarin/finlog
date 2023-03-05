/* eslint-disable @typescript-eslint/no-empty-function */
import {expect, jest} from '@jest/globals'

import { IUploadsStorage, UploadStatus } from '../../storage/uploads'
import { CreateUploadUseCase } from './create'

jest.mock('../../storage/uploads')

describe('create', () => {
  const storage: IUploadsStorage = {
    getUpload: jest.fn(async (id: number, ownerId: number) => ({ id, ownerId, date: new Date(), status: 'new' as UploadStatus, params: {}, rowsCount: 0 })),
    createUpload: jest.fn(async (ownerId: number) => ({ id: 1, ownerId })),
    updateUploadParams: jest.fn(async () => {}),
    updateUploadStatus: jest.fn(async () => {}),
  }

  it('should create a new upload with the specified owner ID, params, and rows', async () => {
    const ownerId = 1
    const params = { rowDelimiter: '\n', fieldDelimiter: '\t' }
    const contentString = 'r1c1\tr1c2\tr1c3\nr2c1\tr2c2\tr2c3\nr3c1\tr3c2\tr3c3'
    const useCase = new CreateUploadUseCase(storage, { ownerId, params, contentString })

    const result = await useCase.do()

    expect(storage.createUpload).toHaveBeenCalledWith(
      ownerId, 
      [['r1c1', 'r1c2', 'r1c3'], ['r2c1', 'r2c2', 'r2c3'], ['r3c1', 'r3c2', 'r3c3']],
      params
    )
    expect(result).toEqual({ id: 1, params })
  })

  it('should throw an error if the content string is empty', () => {
    const ownerId = 1
    const params = { rowDelimiter: '\n', colDelimiter: '\r' }
    const contentString = ''

    const useCase = new CreateUploadUseCase(storage, { ownerId, params, contentString })

    expect(useCase.do()).rejects.toThrow()
  })
})
