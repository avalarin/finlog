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
exports.UsersStorage = void 0;
const selectUserQuery = 'select id, name, full_name ' +
    'from users where id = $1';
class UsersStorage {
    constructor(_database, _logger) {
        this._database = _database;
        this._logger = _logger;
    }
    getUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            this._logger.info(`Getting user by id ${id} from db`);
            try {
                const user = yield this._database.one(selectUserQuery, [id], r => ({
                    id: r.id,
                    name: r.name,
                    fullName: r.full_name,
                }));
                this._logger.info(`Found user ${id} with name ${user.name}`);
                return user;
            }
            catch (e) {
                this._logger.error(`Unable to find user ${id}`, e);
                throw e;
            }
        });
    }
}
exports.UsersStorage = UsersStorage;
//# sourceMappingURL=users.js.map