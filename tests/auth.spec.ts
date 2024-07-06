import jwt from 'jsonwebtoken';
import app from '../src';
import { AppDataSource } from '../src/data-source';
import { Organisation } from '../src/entities/Organisation';
import { cleanupDatabase } from '../src/utils/test';

const isTokenExpired = (token: string) => {
  const { exp } = jwt.decode(token) as { exp: number };
  return exp * 1000 < Date.now();
};

describe('Authentication Endpoints', () => {
  let server;
  let accessToken;
  beforeAll(async () => {
    server = await app;

    const res = await request(server).post('/auth/register').send({});
    accessToken = res.body.data.accessToken;
  });

  afterAll(async () => {
    await cleanupDatabase();
    await AppDataSource.destroy();
  });

  describe('POST /auth/register', () => {
    it('should register a user successfully with default organisation', async () => {
      const res = await request(app).post('/auth/register').send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@mail.com',
        password: 'password123',
        phone: '1234567890',
      });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.user.firstName).toBe('John');
      expect(res.body.data.user.email).toBe('john.doe@mail.com');
      expect(res.body.data.user).toHaveProperty('userId');
      expect(res.body.data).toHaveProperty('accessToken');
      expect(isTokenExpired(res.body.data.accessToken)).toBe(false);

      // Verify default organisation
      const orgRepo = AppDataSource.getRepository(Organisation);
      const organisation = await orgRepo.findOne({
        where: { name: "John's Organisation" },
      });
      expect(organisation).not.toBeNull();
    });

    it('should fail if required fields are missing', async () => {
      const res = await request(app).post('/auth/register').send({
        firstName: 'John',
        email: 'john.doe@mail.com',
        password: 'password123',
      });

      expect(res.status).toBe(422);
      expect(res.body.errors).toEqual(
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
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@mail.com',
        password: 'password123',
        phone: '1234567890',
      });

      const res = await request(app).post('/auth/register').send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'jane.doe@mail.com',
        password: 'password123',
        phone: '0987654321',
      });

      expect(res.status).toBe(422);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'email',
            message: expect.any(String),
          }),
        ])
      );
    });
  });

  describe('POST /auth/login', () => {
    it('should log the user in successfully', async () => {
      await request(app).post('/auth/register').send({
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alice.smith@mail.com',
        password: 'password123',
        phone: '1234567890',
      });

      const res = await request(app).post('/auth/login').send({
        email: 'alice.smith@mail.com',
        password: 'password123',
      });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.user.email).toBe('alice.smith@mail.com');
      expect(res.body.data).toHaveProperty('accessToken');
      expect(isTokenExpired(res.body.data.accessToken)).toBe(false);
    });

    it('should fail if login credentials are incorrect', async () => {
      const res = await request(app).post('/auth/login').send({
        email: 'wrong.email@mail.com',
        password: 'wrongpassword',
      });

      expect(res.status).toBe(401);
      expect(res.body.status).toBe('Bad request');
      expect(res.body.message).toBe('Authentication failed');
    });
  });
});

describe('Organisation Access', () => {
  let accessToken: string;

  beforeAll(async () => {
    // Register a user and obtain a token
    const res = await request(app).post('/auth/register').send({
      firstName: 'Bob',
      lastName: 'Builder',
      email: 'bob.builder@mail.com',
      password: 'password123',
      phone: '1234567890',
    });

    accessToken = res.body.data.accessToken;
  });

  it('should not allow access to organisations the user does not belong to', async () => {
    // Create a second user and organisation
    const res2 = await request(app).post('/auth/register').send({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@mail.com',
      password: 'password123',
      phone: '1234567890',
    });

    const otherOrgId = res2.body.data.organisation.orgId;

    // Attempt to access the other user's organisation
    const res = await request(app)
      .get(`/api/organisations/${otherOrgId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Forbidden');
  });
});
