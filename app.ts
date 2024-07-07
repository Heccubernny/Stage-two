import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import 'reflect-metadata';
import { AppDataSource } from './src/data_source';
import authRoutes from './src/routes/auth';
import organisationRoutes from './src/routes/organisation';
import userRoutes from './src/routes/user';

dotenv.config();

const app = express();
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.get('/', (req, res) => {
  return res.status(404).json({ data: 'Home api is working' });
});
app.use('/auth', authRoutes);
app.use('/api/organisations', organisationRoutes);
app.use('/api/users', userRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((error) => console.log(error));

export default app;
