"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = exports.dbConfig = void 0;
const typeorm_1 = require("typeorm");
const Organisation_1 = require("./entities/Organisation");
const User_1 = require("./entities/User");
const dbName = process.env.DB_NAME || 'stagetwo';
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbPort = parseInt(process.env.DB_PORT || '5432', 10);
exports.dbConfig = {
    type: 'postgres',
    host: dbHost,
    port: dbPort,
    username: dbUser,
    password: dbPassword,
    database: dbName,
    entities: [User_1.User, Organisation_1.Organisation],
    synchronize: true,
    logging: true,
    subscribers: [],
    migrations: [],
};
exports.AppDataSource = new typeorm_1.DataSource(exports.dbConfig);
