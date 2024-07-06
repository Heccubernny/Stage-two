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
exports.cleanupDatabase = exports.initializeTestDataSource = exports.testDataSource = void 0;
const data_source_1 = require("data-source");
const typeorm_1 = require("typeorm");
exports.testDataSource = new typeorm_1.DataSource(data_source_1.dbConfig);
const initializeTestDataSource = () => __awaiter(void 0, void 0, void 0, function* () {
    yield exports.testDataSource.initialize();
});
exports.initializeTestDataSource = initializeTestDataSource;
const cleanupDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    const entities = exports.testDataSource.entityMetadatas;
    for (const entity of entities) {
        const repository = exports.testDataSource.getRepository(entity.name);
        yield repository.query(`TRUNCATE TABLE "${entity.tableName}" CASCADE;`);
    }
});
exports.cleanupDatabase = cleanupDatabase;
