"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = void 0;
const pg_promise_1 = __importDefault(require("pg-promise"));
const pgp = (0, pg_promise_1.default)({});
const connectDatabase = (logger) => {
    var _a;
    const pgOptions = {
        host: process.env.POSTGRES_HOST,
        port: parseInt(process.env.POSTGRES_PORT || '5432'),
        database: process.env.POSTGRES_DB,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        options: `-c search_path=${process.env.POSTGRES_SCHEMA}`,
        ssl: {
            rejectUnauthorized: true,
            ca: ((_a = process.env.POSTGRES_SSL_CA) === null || _a === void 0 ? void 0 : _a.replace(/\\n/g, '\n')) || '',
        }
    };
    logger.info(`Connecting to postgresql ${pgOptions.host}:${pgOptions.port}/${pgOptions.database}...`);
    return pgp(pgOptions);
};
exports.connectDatabase = connectDatabase;
//# sourceMappingURL=connect.js.map