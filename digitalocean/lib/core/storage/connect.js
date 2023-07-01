"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = void 0;
const pg_promise_1 = __importDefault(require("pg-promise"));
const pgp = (0, pg_promise_1.default)({});
const connectDatabase = (config, logger) => {
    const pgOptions = {
        host: config.host,
        port: config.port,
        database: config.database,
        user: config.user,
        password: config.password,
        options: `-c search_path=${config.schema}`,
        ssl: {
            rejectUnauthorized: true,
            ca: config.sslCA,
        }
    };
    logger.info(`Connecting to postgresql ${pgOptions.host}:${pgOptions.port}/${pgOptions.database}...`);
    return pgp(pgOptions);
};
exports.connectDatabase = connectDatabase;
//# sourceMappingURL=connect.js.map