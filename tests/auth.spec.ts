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
  //success
  it('should register a user successfully with default organisation', async () => {
    const response = await request(app).post('/auth/register').send({
      firstName: 'John',
      lastName: 'Doe',
      email: 'dammy21445@fmail.com',
      password: 'password123',
      phone: '1234567890',
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.status).toBe('success');
    expect(response.body.data.user.firstName).toBe('John');
    expect(response.body.data.user.lastName).toBe('Doe');
    expect(response.body.data.user.email).toBe('dammy21445@fmail.com');
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

  //success
  it('should fail if required fields are missing', async () => {
    const response = await request(app).post('/auth/register').send({
      firstName: 'John',
      email: 'janedoe122@fmail.com',
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

  //success
  it('should fail if there is a duplicate email', async () => {
    const response = await request(app).post('/auth/register').send({
      firstName: 'John',
      lastName: 'Doe',
      email: 'farmer@fmail.com',
      password: 'password123',
      phone: '1234567890',
    });

    expect(response.statusCode).toBe(422);
  });

  //success
  it('should log the user in successfully', async () => {
    await request(app).post('/auth/register').send({
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'dami1234567@fmail.com',
      password: 'password123',
      phone: '1234567890',
    });

    const response = await request(app).post('/auth/login').send({
      email: 'dami1234567@fmail.com',
      password: 'password123',
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.data.user.email).toBe('dami1234567@fmail.com');
    expect(response.body.data).toHaveProperty('accessToken');
    // check if token generation expired
    expect(isTokenExpired(response.body.data.accessToken)).toBe(false);
  });

  //success
  it('should fail if login credentials are incorrect', async () => {
    const response = await request(app).post('/auth/login').send({
      email: 'wrondgr@fmail.com',
      password: 'wrondgpassword',
    });

    expect(response.statusCode).toBe(401);
    expect(response.body.status).toBe('Bad request');
    expect(response.body.message).toBe('Authentication failed');
  });
});

describe('Organisation Access', () => {
  let accessToken: string;

  beforeAll(async () => {
    await AppDataSource.initialize();

    // Register a user and obtain a token
    const response = await request(app).post('/auth/register').send({
      firstName: 'John',
      lastName: 'Doe',
      email: 'milk2@fmail.com',
      password: 'password123',
      phone: '1234567890',
    });
  }, 30000);

  afterAll(async () => {
    await AppDataSource.destroy();
  }, 3000);

  it('should not allow access to organisations the user does not belong to', async () => {
    // Create a second user and organisation
    const res2 = await request(app).post('/auth/login').send({
      email: 'milk2@fmail.com',
      password: 'password123',
    });

    accessToken = res2.body.data.accessToken;

    const getOrg = await request(app)
      .get('/api/organisations')
      .set('Authorization', `Bearer ${accessToken}`);

    const otherOrgId = getOrg.body.data.organisations.orgId;

    // Attempt to access the other user's organisation
    const response = await request(app)
      .get(`/api/organisations/${otherOrgId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Client error');
  });
});
