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
const users_1 = require("./users");
const logger_1 = require("../utils/logger");
const pgp = (0, pg_promise_1.default)();
describe('UsersStorage', () => {
    let db;
    let storage;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        db = pgp('postgresql://testuser:testpassword@localhost:5432/testdb');
        yield db.query('insert into users (id, name, full_name) values (1, \'user_a\', \'test\') on conflict do nothing');
        yield db.query('insert into users (id, name, full_name) values (2, \'user_b\', \'test\') on conflict do nothing');
        yield db.query('insert into users (id, name, full_name) values (3, \'user_c\', \'test\') on conflict do nothing');
        storage = new users_1.UsersStorage(db, (0, logger_1.createLogger)());
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db.$pool.end();
    }));
    describe('getUser', () => {
        it('should return the user with the specified ID', () => __awaiter(void 0, void 0, void 0, function* () {
            // arrange
            const userId = 1;
            // act
            const user = yield storage.getUser(userId);
            // assert
            expect(user).toEqual({ id: 1, name: 'user_a', fullName: 'test' });
        }));
        it('should throw an error if the user does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            // arrange
            const userId = 999;
            // act
            const user = storage.getUser(userId);
            // assert
            yield expect(user).rejects.toThrowError('No data returned from the query.');
        }));
    });
});
//# sourceMappingURL=users.test.js.map