"use strict";
exports.__esModule = true;
exports.connectDatabase = void 0;
var pg_promise_1 = require("pg-promise");
var pgp = (0, pg_promise_1["default"])({});
var connectDatabase = function (logger) {
    var _a;
    var pgOptions = {
        host: process.env.POSTGRES_HOST,
        port: parseInt(process.env.POSTGRES_PORT || '5432'),
        database: process.env.POSTGRES_DB,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        options: "-c search_path=".concat(process.env.POSTGRES_SCHEMA),
        ssl: {
            rejectUnauthorized: true,
            ca: ((_a = process.env.POSTGRES_SSL_CA) === null || _a === void 0 ? void 0 : _a.replace(/\\n/g, '\n')) || ''
        }
    };
    logger.info("Connecting to postgresql ".concat(pgOptions.host, ":").concat(pgOptions.port, "/").concat(pgOptions.database, "..."));
    return pgp(pgOptions);
};
exports.connectDatabase = connectDatabase;
