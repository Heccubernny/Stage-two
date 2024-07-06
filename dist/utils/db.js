"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
if (!dbName || !dbUser || !dbPassword || !dbHost) {
    throw new Error('Missing required environment variables for database connection.');
}
const sequelize = new sequelize_1.Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    dialect: 'postgres',
    logging: false,
});
exports.sequelize = sequelize;
sequelize
    .authenticate()
    .then(() => {
    console.log('Connection to the database has been established successfully');
})
    .catch((err) => {
    console.error('Unable to connect to the database: ', err);
});
