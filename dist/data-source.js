"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = exports.dbConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const typeorm_1 = require("typeorm");
const Organisation_1 = require("./entities/Organisation");
const User_1 = require("./entities/User");
dotenv_1.default.config();
const dbUrl = process.env.POSTGRES_URL;
exports.dbConfig = {
    type: 'postgres',
    url: dbUrl,
    entities: [User_1.User, Organisation_1.Organisation],
    synchronize: true,
    logging: true,
    subscribers: [],
    migrations: [],
};
exports.AppDataSource = new typeorm_1.DataSource(exports.dbConfig);
