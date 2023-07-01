"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsStorage = void 0;
const selectUploadQuery = 'select id, owner_id, date, status, type, params, raw_content, ' +
    '(select count(*) from upload_contents where upload_id = $1) as rows_count ' +
    'from uploads where id = $1 and owner_id = $2';
const insertUploadQuery = 'insert into uploads (owner_id, params, raw_content) values ($1, $2, $3) returning id';
const insertUploadRowQuery = 'insert into upload_contents (upload_id, row_index, row_data) values ($1, $2, $3)';
const updateUploadStatusQuery = 'update uploads set status = $3 where id = $1 and owner_id = $2 returning id';
const updateUploadContentQuery = 'update uploads set params = $3, raw_content = $4 where id = $1 and owner_id = $2 returning id';
const deleteUploadRowsQuery = 'delete from upload_contents where upload_id = $1';
class UploadsStorage {
    constructor(database, logger) {
        this._database = database;
        this._logger = logger;
    }
    getUpload(id, ownerId) {
        return __awaiter(this, void 0, void 0, function* () {
            this._logger.info(`Getting upload ${id}, owner=${ownerId} from db`);
            try {
                const upload = yield this._database.one(selectUploadQuery, [id, ownerId], r => ({
                    id: r.id,
                    ownerId: r.owner_id,
                    date: r.date,
                    status: r.status,
                    type: r.type,
                    params: r.params,
                    rawContent: r.raw_content,
                    rowsCount: +r.rows_count
                }));
                this._logger.info(`Found upload ${id} with ${upload.rowsCount}`);
                return upload;
            }
            catch (e) {
                this._logger.error(`Unable to find upload ${id}, owner=${ownerId}`, e);
                throw e;
            }
        });
    }
    createUpload(ownerId, rows, rawContent, params) {
        return __awaiter(this, void 0, void 0, function* () {
            this._logger.info(`Creating upload with owner=${ownerId} and ${rows.length} rows`);
            try {
                const result = yield this._database.tx((t) => __awaiter(this, void 0, void 0, function* () {
                    const uploadId = yield t.one(insertUploadQuery, [ownerId, JSON.stringify(params), rawContent], r => r.id);
                    console.log('Inserted upload with ID:', uploadId);
                    yield Promise.all(rows.map((data, index) => {
                        return t.none(insertUploadRowQuery, [uploadId, index, JSON.stringify(data)]);
                    }));
                    console.log(`Inserted ${rows.length} rows`);
                    return {
                        id: uploadId,
                        ownerId: ownerId
                    };
                }));
                this._logger.info(`Upload ${result.id} created`);
                return result;
            }
            catch (e) {
                this._logger.error('Unable to create upload', e);
                throw e;
            }
        });
    }
    updateUploadStatus(id, ownerId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            this._logger.info(`Updating status of upload with ${id}, owner=${ownerId} to ${status}`);
            try {
                const updatedId = yield this._database.one(updateUploadStatusQuery, [id, ownerId, status], r => r.id);
                if (!updatedId) {
                    throw new Error(`upload ${id} doesn't exist`);
                }
                this._logger.info(`Upload ${id} updated`);
            }
            catch (e) {
                this._logger.error('Unable to update upload', e);
                throw e;
            }
        });
    }
    updateUploadContent(id, ownerId, rows, rawContent, params) {
        return __awaiter(this, void 0, void 0, function* () {
            this._logger.info(`Updating content of upload with ${id}, owner=${ownerId}`);
            try {
                const result = yield this._database.tx((t) => __awaiter(this, void 0, void 0, function* () {
                    const updatedId = yield t.one(updateUploadContentQuery, [id, ownerId, JSON.stringify(params), rawContent], r => r.id);
                    if (!updatedId) {
                        throw new Error(`upload ${id} doesn't exist`);
                    }
                    yield t.none(deleteUploadRowsQuery, [id]);
                    yield Promise.all(rows.map((data, index) => {
                        return t.none(insertUploadRowQuery, [id, index, JSON.stringify(data)]);
                    }));
                    console.log(`Inserted ${rows.length} rows`);
                }));
                this._logger.info(`Upload ${id} updated`);
                return result;
            }
            catch (e) {
                this._logger.error('Unable to update upload', e);
                throw e;
            }
        });
    }
}
exports.UploadsStorage = UploadsStorage;
//# sourceMappingURL=uploads.js.map