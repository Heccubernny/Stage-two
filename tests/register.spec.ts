import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import request from 'supertest';
import app from '../app';
import { AppDataSource } from '../src/data_source';

describe('User Registration', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
  }, 10000);

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  it('Should register user successfully with default organisation', async () => {
    const response = await request(app).post('/auth/register').send({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe1234@example.com',
      password: 'Password123!',
      phone: '1234567890',
    });
    console.log(response.body.data);
    expect(response.statusCode).toBe(201);
    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('Registration successful');
    expect(response.body.data.user).toMatchObject({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe1234@example.com',
      phone: '1234567890',
    });
    expect(response.body.data.user.organisation).toBe("John's Organisation");
    expect(response.body.data.token).toBeDefined();
  });

  it('Should fail if required fields are missing', async () => {
    const response = await request(app).post('/auth/register').send({
      email: 'test@example.com',
    });
    expect(response.statusCode).toBe(400);
  });

  it('Should fail if email is duplicate', async () => {
    await request(app).post('/auth/register').send({
      email: 'duplicate@example.com',
      password: 'password123',
      name: 'Duplicate User',
    });
    const response = await request(app).post('/auth/register').send({
      email: 'duplicate@example.com',
      password: 'password123',
      name: 'Duplicate User',
    });
    expect(response.statusCode).toBe(409);
  });
});
