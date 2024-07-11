import { faker } from '@faker-js/faker';
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import app from '../app';
import { AppDataSource } from '../data_source';
import { Organisation } from '../entities/Organisation';

const isTokenExpired = (token: string) => {
  const { exp } = jwt.decode(token) as { exp: number };
  return exp * 1000 < Date.now();
};

describe('User Registration and Authentication Endpoints', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
  }, 30000);

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  it('Should register user successfully with default organisation', async () => {
    const randomEmail = faker.internet.email();

    const response = await request(app).post('/auth/register').send({
      firstName: 'John',
      lastName: 'Doe',
      email: randomEmail,
      password: 'Password123!',
      phone: '1234567890',
    });
    expect(response.statusCode).toBe(201);
    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('Registration successful');
    expect(response.body.data.user).toMatchObject({
      firstName: 'John',
      lastName: 'Doe',
      email: randomEmail,
      phone: '1234567890',
    });
    expect(response.body.data.accessToken).toBeDefined();
    expect(isTokenExpired(response.body.data.accessToken)).toBe(false);

    // Verify default organisation
    const orgRepo = AppDataSource.getRepository(Organisation);
    const organisation = await orgRepo.findOne({
      where: { name: "John's Organisation" },
    });
    expect(organisation).not.toBeNull();
  });

  it('Should fail if required fields are missing', async () => {
    const response = await request(app).post('/auth/register').send({
      firstName: 'John',
      email: faker.internet.email(),
      password: 'password123',
    });

    expect(response.statusCode).toBe(422);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'lastName',
          message: expect.any(String),
        }),
      ])
    );
  });

  it('Should fail if email is duplicate', async () => {
    const duplicateEmail = 'duplicate@example.com'; // Use a fixed email for testing duplication

    // First registration attempt
    await request(app).post('/auth/register').send({
      email: duplicateEmail,
      password: 'password123',
      name: 'Duplicate User',
    });

    // Second registration attempt with the same email
    const response = await request(app).post('/auth/register').send({
      email: duplicateEmail,
      password: 'password123',
      name: 'Duplicate User',
    });

    expect(response.statusCode).toBe(422);
  });

  it('Should log the user in successfully', async () => {
    const loginEmail = faker.internet.email();
    await request(app).post('/auth/register').send({
      firstName: 'Alice',
      lastName: 'Smith',
      email: loginEmail,
      password: 'password123',
      phone: '1234567890',
    });

    const response = await request(app).post('/auth/login').send({
      email: loginEmail,
      password: 'password123',
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.data.user.email).toBe(loginEmail);
    expect(response.body.data).toHaveProperty('accessToken');
    expect(isTokenExpired(response.body.data.accessToken)).toBe(false);
  });

  it('Should fail if login credentials are incorrect', async () => {
    const response = await request(app).post('/auth/login').send({
      email: 'wrongemail@example.com',
      password: 'wrongpassword',
    });

    expect(response.statusCode).toBe(401);
    expect(response.body.status).toBe('Bad request');
    expect(response.body.message).toBe('Authentication failed');
  });

  describe('Organisation Access', () => {
    let accessToken: string;

    beforeAll(async () => {
      // Register a user and obtain a token
      const orgRegEmail = faker.internet.email();
      const response = await request(app).post('/auth/register').send({
        firstName: 'John',
        lastName: 'Doe',
        email: orgRegEmail,
        password: 'password123',
        phone: '1234567890',
      });
      accessToken = response.body.data.accessToken;
    });

    it('should not allow access to organisations the user does not belong to', async () => {
      // Attempt to access an organisation
      const response = await request(app)
        .get(`/api/organisations/12345`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Client error');
    });
  });
});
