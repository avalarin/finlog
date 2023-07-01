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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_promise_1 = __importDefault(require("pg-promise"));
const uploads_1 = require("./uploads");
const logger_1 = require("../utils/logger");
const pgp = (0, pg_promise_1.default)();
describe('UploadsStorage', () => {
    let db;
    let storage;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        db = pgp('postgresql://testuser:testpassword@localhost:5432/testdb');
        yield db.query('insert into users (id, name, full_name) values (1, \'test\', \'test\') on conflict do nothing');
        storage = new uploads_1.UploadsStorage(db, (0, logger_1.createLogger)());
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db.$pool.end();
    }));
    describe('createUpload', () => {
        it('should insert an upload and its rows', () => __awaiter(void 0, void 0, void 0, function* () {
            // arrange
            const ownerId = 1;
            const rows = [['r1col1', 'r1col2'], ['r2col1', 'r2col2'], ['r3col1', 'r3col2']];
            const rawContent = rows.map(r => r.join('\t')).join('\n');
            // act
            const { id: uploadId } = yield storage.createUpload(ownerId, rows, rawContent, { rowDelimiter: 'x' });
            // assert
            const result1 = yield db.result('SELECT * FROM uploads WHERE id = $1', [uploadId]);
            expect(result1.rows).toHaveLength(1);
            expect(result1.rows[0].raw_content).toEqual(rawContent);
            expect(result1.rows[0].params).toEqual({ rowDelimiter: 'x' });
            const result2 = yield db.result('SELECT * FROM upload_contents WHERE upload_id = $1', [uploadId]);
            expect(result2.rows).toHaveLength(3);
            expect(result2.rows[0].row_data).toHaveLength(2);
            expect(result2.rows[0].row_data[0]).toBe(rows[0][0]);
            expect(result2.rows[1].row_data).toHaveLength(2);
            expect(result2.rows[1].row_data[1]).toBe(rows[1][1]);
            expect(result2.rows[2].row_data).toHaveLength(2);
            expect(result2.rows[2].row_data[0]).toBe(rows[2][0]);
        }));
    });
    describe('getUpload', () => {
        it('should return the upload with the specified ID and owner ID', () => __awaiter(void 0, void 0, void 0, function* () {
            // arrange
            const uploadId = yield db.one('INSERT INTO uploads (owner_id, date, status, type, params, raw_content) VALUES ($2, $3, $4, $5, $6, $7) RETURNING id', [1, 1, new Date(), 'new', 'operations', { param: 'value' }, 'xxxxxx'], r => r.id);
            yield db.none('INSERT INTO upload_contents (upload_id, row_index, row_data) VALUES ($1, $2, $3)', [uploadId, 1, '[1]']);
            yield db.none('INSERT INTO upload_contents (upload_id, row_index, row_data) VALUES ($1, $2, $3)', [uploadId, 1, '[1]']);
            yield db.none('INSERT INTO upload_contents (upload_id, row_index, row_data) VALUES ($1, $2, $3)', [uploadId, 1, '[1]']);
            // act
            const upload = yield storage.getUpload(uploadId, 1);
            // assert
            expect(upload).toEqual({
                id: uploadId,
                ownerId: 1,
                date: expect.any(Date),
                status: 'new',
                type: 'operations',
                params: { param: 'value' },
                rawContent: 'xxxxxx',
                rowsCount: 3,
            });
        }));
        it('should throw an error if the upload does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            yield expect(storage.getUpload(200, 1)).rejects.toThrowError();
        }));
        it('should throw an error if the owner ID does not match', () => __awaiter(void 0, void 0, void 0, function* () {
            yield expect(storage.getUpload(1, 999)).rejects.toThrowError();
        }));
    });
    describe('updateUploadStatus', () => {
        it('should update the status of the upload with the specified ID and owner ID', () => __awaiter(void 0, void 0, void 0, function* () {
            // arrange
            const uploadId = yield db.one('INSERT INTO uploads (owner_id, date, status, type, params) VALUES ($2, $3, $4, $5, $6) RETURNING id', [1, 1, new Date(), 'new', 'operations', { param: 'value' }], r => r.id);
            // act
            yield storage.updateUploadStatus(uploadId, 1, 'completed');
            // assert
            const upload = yield storage.getUpload(uploadId, 1);
            expect(upload.status).toEqual('completed');
        }));
        it('should not update the status of an upload that does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            yield expect(storage.updateUploadStatus(200, 1, 'completed')).rejects.toThrowError();
        }));
        it('should not update the status of an upload that does not belong to the specified owner ID', () => __awaiter(void 0, void 0, void 0, function* () {
            yield expect(storage.updateUploadStatus(1, 999, 'completed')).rejects.toThrowError();
        }));
    });
    describe('updateUploadContent', () => {
        it('should update params of the upload with the specified ID and owner ID', () => __awaiter(void 0, void 0, void 0, function* () {
            // arrange
            const uploadId = yield db.one('INSERT INTO uploads (owner_id, date, status, type, params, raw_content) VALUES ($2, $3, $4, $5, $6, $7) RETURNING id', [1, 1, new Date(), 'new', 'operations', { fieldDelimiter: 'x' }, 'xxxxxx'], r => r.id);
            // act
            yield storage.updateUploadContent(uploadId, 1, [], 'xxxxx', { fieldDelimiter: '1' });
            // assert
            const upload = yield storage.getUpload(uploadId, 1);
            expect(upload.params).toEqual({ fieldDelimiter: '1' });
        }));
        it('should update raw content of the upload with the specified ID and owner ID', () => __awaiter(void 0, void 0, void 0, function* () {
            // arrange
            const uploadId = yield db.one('INSERT INTO uploads (owner_id, date, status, type, params, raw_content) VALUES ($2, $3, $4, $5, $6, $7) RETURNING id', [1, 1, new Date(), 'new', 'operations', { fieldDelimiter: 'x' }, 'xxxxxx'], r => r.id);
            // act
            yield storage.updateUploadContent(uploadId, 1, [], 'yyyyyy', { fieldDelimiter: 'x' });
            // assert
            const upload = yield storage.getUpload(uploadId, 1);
            expect(upload.rawContent).toEqual('yyyyyy');
        }));
        it('should update rows of the upload with the specified ID and owner ID', () => __awaiter(void 0, void 0, void 0, function* () {
            // arrange
            const uploadId = yield db.one('INSERT INTO uploads (owner_id, date, status, type, params, raw_content) VALUES ($2, $3, $4, $5, $6, $7) RETURNING id', [1, 1, new Date(), 'new', 'operations', { fieldDelimiter: 'x' }, 'xxxxxx'], r => r.id);
            yield Promise.all([1, 2, 3].map(() => __awaiter(void 0, void 0, void 0, function* () {
                yield db.none('INSERT INTO upload_contents (upload_id, row_index, row_data) VALUES ($1, $2, $3)', [uploadId, 1, '[1, 2, 3]']);
                yield db.none('INSERT INTO upload_contents (upload_id, row_index, row_data) VALUES ($1, $2, $3)', [uploadId, 2, '[4, 5, 6]']);
                yield db.none('INSERT INTO upload_contents (upload_id, row_index, row_data) VALUES ($1, $2, $3)', [uploadId, 3, '[7, 8, 9]']);
            })));
            // act
            yield storage.updateUploadContent(uploadId, 1, [['100', '200'], ['300', '400']], 'xxxxx', { fieldDelimiter: 'x' });
            // assert
            const upload = yield storage.getUpload(uploadId, 1);
            expect(upload.rowsCount).toEqual(2);
            const rows = yield db.many('SELECT row_index, row_data FROM upload_contents WHERE upload_id = $1', [uploadId]);
            expect(rows).toHaveLength(2);
            expect(rows[0]).toEqual({ row_index: 0, row_data: ['100', '200'] });
            expect(rows[1]).toEqual({ row_index: 1, row_data: ['300', '400'] });
        }));
        it('should not params the status of an upload that does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            yield expect(storage.updateUploadContent(200, 1, [], '', { fieldDelimiter: '1' })).rejects.toThrowError();
        }));
        it('should not params the status of an upload that does not belong to the specified owner ID', () => __awaiter(void 0, void 0, void 0, function* () {
            yield expect(storage.updateUploadContent(1, 999, [], '', { fieldDelimiter: '1' })).rejects.toThrowError();
        }));
    });
});
//# sourceMappingURL=uploads.test.js.map