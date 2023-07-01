"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = void 0;
require("dotenv/config");
const getConfig = () => {
    return {
        database: () => {
            var _a;
            return ({
                host: process.env.POSTGRES_HOST,
                port: parseInt(process.env.POSTGRES_PORT || '5432'),
                database: process.env.POSTGRES_DB,
                user: process.env.POSTGRES_USER,
                password: process.env.POSTGRES_PASSWORD,
                schema: process.env.POSTGRES_SCHEMA,
                sslCA: ((_a = process.env.POSTGRES_SSL_CA) === null || _a === void 0 ? void 0 : _a.replace(/\\n/g, '\n')) || ''
            });
        },
        apilayer: () => ({
            url: process.env.APILAYER_URL,
            token: process.env.APILAYER_TOKEN
        })
    };
};
exports.getConfig = getConfig;
//# sourceMappingURL=config.js.map