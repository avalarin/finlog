import { IUploadsStorage, Upload, UploadParams } from '../storage/uploads'
import { CreateUploadRequest, CreateUploadResult, CreateUploadUseCase } from '../use-cases/upload/create'
import { CommandError } from '../utils/error'
import { Logger } from '../utils/logger'

export class UploadHandler {
  private _storage: IUploadsStorage
  private _logger: Logger

  constructor(storage: IUploadsStorage, logger: Logger) {
    this._storage = storage
    this._logger = logger
  }

  async get(id: number, ownerId: number): Promise<Upload> {
    if (!id) {
      throw new CommandError('id should be present')
    }
    if (!ownerId) {
      throw new CommandError('ownerId should be present')
    }

    return await this._storage.getUpload(id, ownerId)
  }

  async create(ownerId: number, contentString: string, params?: UploadParams): Promise<CreateUploadResult> {
    if (!ownerId) {
      throw new CommandError('ownerId should be present')
    }
    if (!contentString) {
      throw new CommandError('contentString should be present')
    }

    const req: CreateUploadRequest = {ownerId, params: params || {}, contentString}
    const usecase = new CreateUploadUseCase(this._storage, req)

    return await usecase.do()
  }

  async updateParams(id: number, ownerId: number, params: UploadParams): Promise<void> {
    this._logger.info(`updateParams ${id}, ${ownerId}, ${params}`)
    return
  }

  async complete(id: number, ownerId: number): Promise<void> {
    this._logger.info(`updateParams ${id}, ${ownerId}`)
    return
  }
}

