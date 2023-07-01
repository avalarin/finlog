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
const dictionaries_1 = require("./dictionaries");
const logger_1 = require("../utils/logger");
const pgp = (0, pg_promise_1.default)();
describe('DictionariesStorage', () => {
    let db;
    let storage;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        db = pgp('postgresql://testuser:testpassword@localhost:5432/testdb');
        storage = new dictionaries_1.DictionariesStorage(db, (0, logger_1.createLogger)());
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db.$pool.end();
    }));
    describe('getCurrencies', () => {
        it('should return the currencies', () => __awaiter(void 0, void 0, void 0, function* () {
            // act
            const currencies = yield storage.getCurrencies(0);
            // assert
            expect(currencies.find(c => c.code === 'USD')).toEqual({ code: 'USD', name: 'United States Dollar', flag: '🇺🇸' });
            expect(currencies.find(c => c.code === 'EUR')).toEqual({ code: 'EUR', name: 'Euro', flag: '🇪🇺' });
            expect(currencies.find(c => c.code === 'RUB')).toEqual({ code: 'RUB', name: 'Russian Ruble', flag: '🇷🇺' });
        }));
    });
    describe('getCategories', () => {
        it('should return the categories', () => __awaiter(void 0, void 0, void 0, function* () {
            // act
            const categories = yield storage.getCategories(0);
            // assert
            expect(categories.find(c => c.name === '💰 Разное')).toBeDefined();
            expect(categories.find(c => c.name === '👕 Одежда')).toBeDefined();
            expect(categories.find(c => c.name === '💻 Техника')).toBeDefined();
        }));
    });
    describe('getAccounts', () => {
        const testUserName = 'user_' + Math.random().toString(36).substring(2, 15);
        let testUserId;
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            const r = yield db.query('insert into users (name, full_name) values ($1, \'test\') returning id', [testUserName]);
            testUserId = r[0].id;
            const testAccounts = [
                { name: 'Основной', currency: 'RUB', category: 'current', owner_id: testUserId, country_id: 643, comment: 'Основной счет' },
                { name: 'Запасной', currency: 'KZT', category: 'current', owner_id: testUserId, country_id: 398, comment: 'Запасной счет' },
                { name: 'Накопления', currency: 'USD', category: 'savings', owner_id: testUserId, country_id: 643, comment: 'Запасной счет' },
            ];
            yield Promise.all(testAccounts.map((a) => __awaiter(void 0, void 0, void 0, function* () {
                return yield db.query('insert into accounts (name, currency, category, country_id, owner_id, comment) values ($1, $2, $3, $4, $5, $6) on conflict do nothing', [a.name, a.currency, a.category, a.country_id, a.owner_id, a.comment]);
            })));
        }));
        afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
            yield db.query('delete from accounts where owner_id = $1', [testUserId]);
            yield db.query('delete from users where id = $1', [testUserId]);
        }));
        it('should return the accounts', () => __awaiter(void 0, void 0, void 0, function* () {
            // act
            const accounts = yield storage.getAccounts(testUserId);
            // assert
            expect(accounts.length).toEqual(3);
            expect(accounts.find(a => a.name === 'Основной')).toEqual({
                id: expect.any(Number),
                createdAt: expect.any(Date),
                name: 'Основной',
                currency: 'RUB',
                comment: 'Основной счет',
                category: {
                    code: 'current',
                    name: 'Текущий',
                    description: 'Для ежедневных трат',
                },
                country: {
                    id: 643,
                    name: 'Russia',
                    flag: '🇷🇺',
                },
                owner: {
                    id: testUserId,
                    name: testUserName,
                    fullName: 'test',
                }
            });
        }));
        it('should return empty list for unknown user', () => __awaiter(void 0, void 0, void 0, function* () {
            // act
            const accounts = yield storage.getAccounts(999);
            // assert
            expect(accounts).toEqual([]);
        }));
    });
});
//# sourceMappingURL=dictionaries.test.js.map