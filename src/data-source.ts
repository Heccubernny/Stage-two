import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { Organisation } from './entities/Organisation';
import { User } from './entities/User';
dotenv.config();
const dbUrl = process.env.POSTGRES_URL;
export const dbConfig = {
  type: 'postgres' as const,
  url: dbUrl,
  entities: [User, Organisation],
  synchronize: true,
  logging: true,
  subscribers: [],
  migrations: [],
};
export const AppDataSource = new DataSource(dbConfig);
