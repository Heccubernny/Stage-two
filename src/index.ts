import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import 'reflect-metadata';
import { AppDataSource } from './data-source';
import authRoutes from './routes/auth';
import organisationRoutes from './routes/organisation';
import userRoutes from './routes/user';
dotenv.config();

const API_KEY = process.env.HNG_API_KEY;
const PORT = process.env.PORT || 8000;
const app = express();
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.get('/', async (req, res) => {
  return res.status(404).json({ data: 'Home api is working' });
});

AppDataSource.initialize()
  .then(() => {
    console.log('Connected to the database');

    app.use('/auth', authRoutes);
    app.use('/api/organisations', organisationRoutes);
    app.use('/api/users', userRoutes);
    app.listen(PORT, () => {
      console.log(`Server started on http://localhost:${PORT}`);
    });
  })

  .catch((error) => console.log(error));

export default app;
