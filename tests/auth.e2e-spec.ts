import bodyParser from 'body-parser';
import express from 'express';
import request from 'supertest';
import { AppDataSource } from '../dist/data-source';
import authRoutes from '../src/routes/auth';
import organisationRoutes from '../src/routes/organisation';
import userRoutes from '../src/routes/user';
import { cleanupDatabase } from '../src/utils/test';

const app = express();
app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use('/api/organisations', organisationRoutes);
app.use('/api/users', userRoutes);
beforeAll(async () => {
  await AppDataSource.initialize();
});

afterAll(async () => {
  await cleanupDatabase();
});

describe('AuthController (e2e)', () => {
  let token;
  let user;

  describe('POST /auth/register', () => {
    it('should return validation error if required fields are missing', async () => {
      const response = await request(app).post('/auth/register').send({});
      const missingFields = ['firstName', 'lastName', 'email', 'password'];

      expect(response.status).toBe(422);
      expect(response.body.errors).toBeDefined();
      response.body.errors.forEach((error) => {
        expect(error).toHaveProperty('field');
        expect(missingFields).toContain(error.field);
      });
    });

    it('should register a new user', async () => {
      const response = await request(app).post('/auth/register').send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password',
        phone: '1234567890',
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('accessToken');
      user = response.body.user;
    });

    it('should return an error if user already exists', async () => {
      const response = await request(app).post('/auth/register').send({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: 'password',
        phone: '1234567890',
      });

      expect(response.status).toBe(422);
      expect(response.body.message).toBe('Registration unsuccessful');
    });

    it('should return 401 error if login fails', async () => {
      const response = await request(app).post('/auth/login').send({
        email: 'john.doe@example.com',
        password: 'wrong password',
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Authentication failed');
    });

    it('should login a user', async () => {
      const response = await request(app).post('/auth/login').send({
        email: 'john.doe@example.com',
        password: 'password',
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      token = response.body.accessToken;
    });
  });
});
