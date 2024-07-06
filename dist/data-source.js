"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const Organisation_1 = require("./entities/Organisation");
const User_1 = require("./entities/User");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '',
    database: 'stagetwo',
    entities: [User_1.User, Organisation_1.Organisation],
    synchronize: true,
    logging: true,
    subscribers: [],
    migrations: [],
});
