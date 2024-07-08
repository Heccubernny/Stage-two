import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import 'reflect-metadata';
import { AppDataSource } from './data_source';
import authRoutes from './routes/auth';
import organisationRoutes from './routes/organisation';
import userRoutes from './routes/user';
dotenv.config();

const app = express();
app.use(
  helmet({
    xPoweredBy: false,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.use(cors());
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
