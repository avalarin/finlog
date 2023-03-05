import { IUploadsStorage, UploadParams } from '../../storage/uploads'

export interface CreateUploadRequest {
    ownerId: number,
    params: UploadParams,
    contentString: string
}

export interface CreateUploadResult {
    id: number
    params: UploadParams
}

export class CreateUploadUseCase {
  private _storage: IUploadsStorage
  private _req: CreateUploadRequest

  constructor(storage: IUploadsStorage, req: CreateUploadRequest) {
    this._storage = storage
    this._req = req
  }

  async do(): Promise<CreateUploadResult> {
    if (!this._req.contentString) {
      throw new Error('Content string is empty')
    }

    const rowDelimiter = this._req.params.rowDelimiter || '\n'
    const fieldDelimiter = this._req.params.fieldDelimiter || '\t'

    const rows = this._req.contentString.split(rowDelimiter)
      .map(r => r.split(fieldDelimiter))

    const upload = await this._storage.createUpload(this._req.ownerId, rows, this._req.params)

    return {
      id: upload.id,
      params: this._req.params
    }
  }
}
