// expect, it
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

describe('Authentication Endpoints', () => {
  let accessToken;
  beforeAll(async () => {
    await AppDataSource.initialize();
  }, 30000);

  afterAll(async () => {
    await AppDataSource.destroy();
  }, 3000);

  it('should register a user successfully with default organisation', async () => {
    const response = await request(app).post('/auth/register').send({
      firstName: 'John',
      lastName: 'Doe',
      email: 'damy@fmail.com',
      password: 'password123',
      phone: '1234567890',
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.status).toBe('success');
    expect(response.body.data.user.firstName).toBe('John');
    expect(response.body.data.user.lastName).toBe('Doe');
    expect(response.body.data.user.email).toBe('damy@fmail.com');
    expect(response.body.data.user).toHaveProperty('userId');
    expect(response.body.data).toHaveProperty('accessToken');
    expect(isTokenExpired(response.body.data.accessToken)).toBe(false);

    //       // Verify default organisation
    const orgRepo = AppDataSource.getRepository(Organisation);
    const organisation = await orgRepo.findOne({
      where: { name: "John's Organisation" },
    });
    expect(organisation).not.toBeNull();
  });

  it('should fail if required fields are missing', async () => {
    const response = await request(app).post('/auth/register').send({
      firstName: 'John',
      email: 'janedoe@fmail.com',
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

  it('should fail if there is a duplicate email', async () => {
    await request(app).post('/auth/register').send({
      email: 'duplicate@example.com',
      password: 'password123',
    });

    const response = await request(app).post('/auth/register').send({
      email: 'duplicate@example.com',
      password: 'password123',
    });

    expect(response.statusCode).toBe(422);
    // expect(response.body.errors).toEqual(
    //   expect.arrayContaining([
    //     expect.objectContaining({
    //       field: 'email',
    //       message: expect.any(String),
    //     }),
    //   ])
    // );
  });
});

it('should log the user in successfully', async () => {
  await request(app).post('/auth/register').send({
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'dami12345@fmail.com',
    password: 'password123',
    phone: '1234567890',
  });

  const response = await request(app).post('/auth/login').send({
    email: 'dami12345@fmail.com',
    password: 'password123',
  });

  response;
  expect(response.statusCode).toBe(200);
  expect(response.body.status).toBe('success');
  expect(response.body.data.user.email).toBe('dami1234@fmail.com');
  expect(response.body.data).toHaveProperty('accessToken');
  // check if token generation expired
  expect(isTokenExpired(response.body.data.accessToken)).toBe(false);
});

it('should fail if login credentials are incorrect', async () => {
  const response = await request(app).post('/auth/login').send({
    email: 'wrong@fmail.com',
    password: 'wrongpassword',
  });

  expect(response.statusCode).toBe(401);
  expect(response.body.status).toBe('Bad request');
  expect(response.body.message).toBe('Authentication failed');
});
// });

describe('Organisation Access', () => {
  let accessToken: string;

  beforeAll(async () => {
    // Register a user and obtain a token
    const response = await request(app).post('/auth/register').send({
      firstName: 'Bob',
      lastName: 'Builder',
      email: 'bob.builder121@fmail.com',
      password: 'password123',
      phone: '1234567890',
    });

    accessToken = response.body.data.accessToken;
  });

  it('should not allow access to organisations the user does not belong to', async () => {
    // Create a second user and organisation
    const res2 = await request(app).post('/auth/register').send({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith2121@fmail.com',
      password: 'password123',
      phone: '1234567890',
    });

    const otherOrgId = res2.body.data.organisation.orgId;

    // Attempt to access the other user's organisation
    const response = await request(app)
      .get(`/api/organisations/${otherOrgId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Forbidden');
  });
});
