import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { Organisation } from './entities/Organisation';
import { User } from './entities/User';
dotenv.config();
const dbUrl = process.env.POSTGRES_URL;
const dbName = process.env.POSTGRES_DATABASE;
const dbPassword = process.env.POSTGRES_DATABASE;
// DB_PASSWORD;
const dbHost = process.env.POSTGRES_HOST;
const dbPort = process.env.POSTGRES_PORT;
const dbUser = process.env.POSTGRES_USER;

export const dbConfig = {
  type: 'postgres' as const,
  url: dbUrl,
  // username: dbUser,
  // password: dbPassword,
  // host: dbHost,
  // database: dbName,
  // port: 5432,
  entities: [ User, Organisation ],
  synchronize: true,
  logging: true,
  subscribers: [],
  migrations: [],
};
export const AppDataSource = new DataSource( dbConfig );