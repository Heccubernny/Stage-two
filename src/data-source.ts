import { DataSource } from 'typeorm';
import { Organisation } from './entities/Organisation';
import { User } from './entities/User';

const dbName = process.env.DB_NAME || 'stagetwo';
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbPort = parseInt(process.env.DB_PORT || '5432', 10);

export const dbConfig = {
  type: 'postgres' as const,
  host: dbHost,
  port: dbPort,
  username: dbUser,
  password: dbPassword,
  database: dbName,
  entities: [User, Organisation],
  synchronize: true,
  logging: true,
  subscribers: [],
  migrations: [],
};
export const AppDataSource = new DataSource(dbConfig);
