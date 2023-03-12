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

  async handle(command: string, args: any): Promise<any> {
    if (command === 'create') {
      const { ownerId, contentString, params } = args
      return await this.create(ownerId, contentString, params)
    } else if (command === 'get') {
      const { id, ownerId } = args
      return await this.get(id, ownerId)
    } else if (command === 'update_params') {
      const { id, ownerId, params } = args
      return await this.updateParams(id, ownerId, params)
    } else if (command === 'complete') {
      const { id, ownerId } = args
      return await this.complete(id, ownerId)
    } else {
      throw new CommandError(`Unknown command ${command}`)
    }
  }

  async get(idArg: string, ownerIdArg: string): Promise<Upload> {
    if (!idArg) throw new CommandError('id should be present')
    const id = Number(idArg)
    if (isNaN(id)) throw new CommandError('id has invalid number')

    if (!ownerIdArg) throw new CommandError('ownerId should be present')
    const ownerId = Number(ownerIdArg)
    if (isNaN(ownerId)) throw new CommandError('ownerId has invalid number')

    return await this._storage.getUpload(id, ownerId)
  }

  async create(ownerIdArg: number, contentString: string, paramsArg?: string): Promise<CreateUploadResult> {
    if (!ownerIdArg) throw new CommandError('ownerId should be present')
    const ownerId = Number(ownerIdArg)
    if (isNaN(ownerId)) throw new CommandError('ownerId has invalid number')

    if (!contentString) {
      throw new CommandError('contentString should be present')
    }

    let params: UploadParams
    try {
      params = paramsArg ? JSON.parse(paramsArg) as UploadParams : {}
    } catch {
      throw new CommandError('params should be json string')
    }

    const req: CreateUploadRequest = {ownerId, params: params || {}, contentString}
    const usecase = new CreateUploadUseCase(this._storage, req)

    return await usecase.do()
  }

  async updateParams(idArg: string, ownerIdArg: string, paramsArg: string): Promise<void> {
    if (!idArg) throw new CommandError('id should be present')
    const id = Number(idArg)
    if (isNaN(id)) throw new CommandError('id has invalid number')

    if (!ownerIdArg) throw new CommandError('ownerId should be present')
    const ownerId = Number(ownerIdArg)
    if (isNaN(ownerId)) throw new CommandError('ownerId has invalid number')

    let params: UploadParams
    if (!paramsArg) throw new CommandError('params should be present')
    try {
      params = JSON.parse(paramsArg) as UploadParams
    } catch {
      throw new CommandError('params should be json string')
    }

    this._logger.info(`updateParams ${id}, ${ownerId}, ${params}`)
    return
  }

  async complete(idArg: string, ownerIdArg: string): Promise<void> {
    if (!idArg) throw new CommandError('id should be present')
    const id = Number(idArg)
    if (isNaN(id)) throw new CommandError('id has invalid number')

    if (!ownerIdArg) throw new CommandError('ownerId should be present')
    const ownerId = Number(ownerIdArg)
    if (isNaN(ownerId)) throw new CommandError('ownerId has invalid number')

    this._logger.info(`updateParams ${id}, ${ownerId}`)
    return
  }
}

