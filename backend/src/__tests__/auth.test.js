const request = require('supertest');
const app = require('../app');
const { prisma, cleanDatabase, createTestUser } = require('./setup');

beforeAll(async () => {
  await cleanDatabase();
});

afterAll(async () => {
  await cleanDatabase();
  await prisma.$disconnect();
});

describe('Auth API', () => {
  describe('POST /api/auth/signup', () => {
    it('should create a new user and return tokens', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'newuser@test.com',
          username: 'newuser',
          password: 'password123',
        });

      expect(res.status).toBe(201);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe('newuser@test.com');
      expect(res.body.user.username).toBe('newuser');
      expect(res.body.user.password).toBeUndefined();
      expect(res.body.accessToken).toBeDefined();
      expect(res.body.refreshToken).toBeDefined();
    });

    it('should reject duplicate email', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'newuser@test.com',
          username: 'differentuser',
          password: 'password123',
        });

      expect(res.status).toBe(409);
      expect(res.body.error).toContain('Email already registered');
    });

    it('should reject invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'invalid',
          username: 'user2',
          password: 'password123',
        });

      expect(res.status).toBe(400);
    });

    it('should reject short password', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'short@test.com',
          username: 'shortpw',
          password: '12345',
        });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'newuser@test.com',
          password: 'password123',
        });

      expect(res.status).toBe(200);
      expect(res.body.user).toBeDefined();
      expect(res.body.accessToken).toBeDefined();
      expect(res.body.refreshToken).toBeDefined();
    });

    it('should reject wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'newuser@test.com',
          password: 'wrongpassword',
        });

      expect(res.status).toBe(401);
    });

    it('should reject non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nobody@test.com',
          password: 'password123',
        });

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should return new tokens with valid refresh token', async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'newuser@test.com', password: 'password123' });

      const res = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: loginRes.body.refreshToken });

      expect(res.status).toBe(200);
      expect(res.body.accessToken).toBeDefined();
      expect(res.body.refreshToken).toBeDefined();
    });

    it('should reject missing refresh token', async () => {
      const res = await request(app)
        .post('/api/auth/refresh')
        .send({});

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return current user profile', async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'newuser@test.com', password: 'password123' });

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${loginRes.body.accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe('newuser@test.com');
    });

    it('should reject unauthenticated request', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout successfully', async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'newuser@test.com', password: 'password123' });

      const res = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${loginRes.body.accessToken}`)
        .send({ refreshToken: loginRes.body.refreshToken });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Logged out successfully');
    });
  });
});
