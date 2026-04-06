const request = require('supertest');
const app = require('../app');
const { prisma, cleanDatabase, createTestUser } = require('./setup');

let adminToken, userToken, adminUser, regularUser;

beforeAll(async () => {
  await cleanDatabase();

  adminUser = await createTestUser({
    email: 'admin@users-test.com',
    username: 'admintest',
    password: 'admin123',
    role: 'admin',
  });

  regularUser = await createTestUser({
    email: 'user@users-test.com',
    username: 'usertest',
    password: 'user123',
    role: 'user',
  });

  const adminLogin = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@users-test.com', password: 'admin123' });
  adminToken = adminLogin.body.accessToken;

  const userLogin = await request(app)
    .post('/api/auth/login')
    .send({ email: 'user@users-test.com', password: 'user123' });
  userToken = userLogin.body.accessToken;
});

afterAll(async () => {
  await cleanDatabase();
  await prisma.$disconnect();
});

describe('Users API', () => {
  describe('GET /api/users', () => {
    it('admin should list all users', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.users).toBeDefined();
      expect(res.body.pagination).toBeDefined();
      expect(res.body.users.length).toBeGreaterThanOrEqual(2);
    });

    it('regular user should be denied', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(403);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should get user by id', async () => {
      const res = await request(app)
        .get(`/api/users/${regularUser.id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.user.id).toBe(regularUser.id);
    });

    it('should return 404 for non-existent user', async () => {
      const res = await request(app)
        .get('/api/users/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/users/:id', () => {
    it('user should update own profile', async () => {
      const res = await request(app)
        .put(`/api/users/${regularUser.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ theme: 'light', volume: 0.9 });

      expect(res.status).toBe(200);
      expect(res.body.user.theme).toBe('light');
      expect(res.body.user.volume).toBe(0.9);
    });

    it('user should not update another user', async () => {
      const res = await request(app)
        .put(`/api/users/${adminUser.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ theme: 'light' });

      expect(res.status).toBe(403);
    });

    it('admin can update any user', async () => {
      const res = await request(app)
        .put(`/api/users/${regularUser.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ language: 'fr' });

      expect(res.status).toBe(200);
      expect(res.body.user.language).toBe('fr');
    });
  });

  describe('PATCH /api/users/:id/status', () => {
    it('admin should update user status', async () => {
      const res = await request(app)
        .patch(`/api/users/${regularUser.id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'suspended' });

      expect(res.status).toBe(200);
      expect(res.body.user.status).toBe('suspended');
    });

    it('should reactivate user', async () => {
      const res = await request(app)
        .patch(`/api/users/${regularUser.id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'active' });

      expect(res.status).toBe(200);
      expect(res.body.user.status).toBe('active');
    });
  });
});
