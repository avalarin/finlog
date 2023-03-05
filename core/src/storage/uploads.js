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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.UploadsStorage = void 0;
var selectUploadQuery = 'select id, owner_id, date, status, type, params, ' +
    '(select count(*) from upload_contents where upload_id = $1) as rows_count ' +
    'from uploads where id = $1 and owner_id = $2';
var insertUploadQuery = 'insert into uploads (owner_id, params) values ($1, $2) returning id';
var insertUploadRowQuery = 'insert into upload_contents (upload_id, row_index, row_data) values ($1, $2, $3)';
var updateUploadStatusQuery = 'update uploads set status = $3 where id = $1 and owner_id = $2 returning id';
var updateUploadParamsQuery = 'update uploads set params = $3 where id = $1 and owner_id = $2 returning id';
var UploadsStorage = /** @class */ (function () {
    function UploadsStorage(database, logger) {
        this._database = database;
        this._logger = logger;
    }
    UploadsStorage.prototype.getUpload = function (id, ownerId) {
        return __awaiter(this, void 0, void 0, function () {
            var upload, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._logger.info("Getting upload ".concat(id, ", owner=").concat(ownerId, " from db"));
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this._database.one(selectUploadQuery, [id, ownerId], function (r) { return ({
                                id: r.id,
                                ownerId: r.owner_id,
                                date: r.date,
                                status: r.status,
                                type: r.type,
                                params: r.params,
                                rowsCount: +r.rows_count
                            }); })];
                    case 2:
                        upload = _a.sent();
                        this._logger.info("Found upload ".concat(id, " with ").concat(upload.rowsCount));
                        return [2 /*return*/, upload];
                    case 3:
                        e_1 = _a.sent();
                        this._logger.error("Unable to find upload ".concat(id, ", owner=").concat(ownerId), e_1);
                        throw e_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UploadsStorage.prototype.createUpload = function (ownerId, rows, params) {
        return __awaiter(this, void 0, void 0, function () {
            var result, e_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._logger.info("Creating upload with owner=".concat(ownerId, " and ").concat(rows.length, " rows"));
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this._database.tx(function (t) { return __awaiter(_this, void 0, void 0, function () {
                                var uploadId;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, t.one(insertUploadQuery, [ownerId, JSON.stringify(params)], function (r) { return r.id; })];
                                        case 1:
                                            uploadId = _a.sent();
                                            console.log('Inserted upload with ID:', uploadId);
                                            return [4 /*yield*/, Promise.all(rows.map(function (data, index) {
                                                    return t.none(insertUploadRowQuery, [uploadId, index, JSON.stringify(data)]);
                                                }))];
                                        case 2:
                                            _a.sent();
                                            console.log("Inserted ".concat(rows.length, " rows"));
                                            return [2 /*return*/, {
                                                    id: uploadId,
                                                    ownerId: ownerId
                                                }];
                                    }
                                });
                            }); })];
                    case 2:
                        result = _a.sent();
                        this._logger.info("Upload ".concat(result.id, " created"));
                        return [2 /*return*/, result];
                    case 3:
                        e_2 = _a.sent();
                        this._logger.error('Unable to create upload', e_2);
                        throw e_2;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UploadsStorage.prototype.updateUploadStatus = function (id, ownerId, status) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedId, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._logger.info("Updating status of upload with ".concat(id, ", owner=").concat(ownerId, " to ").concat(status));
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this._database.one(updateUploadStatusQuery, [id, ownerId, status], function (r) { return r.id; })];
                    case 2:
                        updatedId = _a.sent();
                        if (!updatedId) {
                            throw new Error("upload ".concat(id, " doesn't exist"));
                        }
                        this._logger.info("Upload ".concat(id, " updated"));
                        return [3 /*break*/, 4];
                    case 3:
                        e_3 = _a.sent();
                        this._logger.error('Unable to update upload', e_3);
                        throw e_3;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UploadsStorage.prototype.updateUploadParams = function (id, ownerId, params) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedId, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._logger.info("Updating params of upload with ".concat(id, ", owner=").concat(ownerId, " to ").concat(JSON.stringify(params)));
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this._database.one(updateUploadParamsQuery, [id, ownerId, JSON.stringify(params)], function (r) { return r.id; })];
                    case 2:
                        updatedId = _a.sent();
                        if (!updatedId) {
                            throw new Error("upload ".concat(id, " doesn't exist"));
                        }
                        this._logger.info("Upload ".concat(id, " updated"));
                        return [3 /*break*/, 4];
                    case 3:
                        e_4 = _a.sent();
                        this._logger.error('Unable to update upload', e_4);
                        throw e_4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return UploadsStorage;
}());
exports.UploadsStorage = UploadsStorage;
