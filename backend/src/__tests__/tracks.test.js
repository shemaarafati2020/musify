const request = require('supertest');
const app = require('../app');
const { prisma, cleanDatabase, createTestUser, createTestArtist, createTestAlbum, createTestTrack } = require('./setup');

let adminToken, userToken, artist, album, track;

beforeAll(async () => {
  await cleanDatabase();

  const adminUser = await createTestUser({
    email: 'admin@tracks-test.com',
    username: 'trackadmin',
    password: 'admin123',
    role: 'admin',
  });

  const regularUser = await createTestUser({
    email: 'user@tracks-test.com',
    username: 'trackuser',
    password: 'user123',
    role: 'user',
  });

  const adminLogin = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@tracks-test.com', password: 'admin123' });
  adminToken = adminLogin.body.accessToken;

  const userLogin = await request(app)
    .post('/api/auth/login')
    .send({ email: 'user@tracks-test.com', password: 'user123' });
  userToken = userLogin.body.accessToken;

  artist = await createTestArtist({ name: 'Test Artist' });
  album = await createTestAlbum(artist.id, { name: 'Test Album' });
  track = await createTestTrack(artist.id, album.id, { name: 'Test Track' });
});

afterAll(async () => {
  await cleanDatabase();
  await prisma.$disconnect();
});

describe('Tracks API', () => {
  describe('GET /api/tracks', () => {
    it('should list all tracks', async () => {
      const res = await request(app).get('/api/tracks');
      expect(res.status).toBe(200);
      expect(res.body.tracks).toBeDefined();
      expect(res.body.tracks.length).toBeGreaterThanOrEqual(1);
    });

    it('should search tracks', async () => {
      const res = await request(app).get('/api/tracks?search=Test');
      expect(res.status).toBe(200);
      expect(res.body.tracks.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('GET /api/tracks/:id', () => {
    it('should get track by id', async () => {
      const res = await request(app).get(`/api/tracks/${track.id}`);
      expect(res.status).toBe(200);
      expect(res.body.track.name).toBe('Test Track');
      expect(res.body.track.artist).toBeDefined();
    });
  });

  describe('POST /api/tracks', () => {
    it('admin should create a track', async () => {
      const res = await request(app)
        .post('/api/tracks')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'New Track',
          artistId: artist.id,
          albumId: album.id,
          duration: 180,
        });

      expect(res.status).toBe(201);
      expect(res.body.track.name).toBe('New Track');
    });

    it('regular user should be denied', async () => {
      const res = await request(app)
        .post('/api/tracks')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Another Track',
          artistId: artist.id,
          duration: 200,
        });

      expect(res.status).toBe(403);
    });
  });

  describe('POST /api/tracks/:id/like', () => {
    it('should like a track', async () => {
      const res = await request(app)
        .post(`/api/tracks/${track.id}/like`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.liked).toBe(true);
    });

    it('should unlike a track on second call', async () => {
      const res = await request(app)
        .post(`/api/tracks/${track.id}/like`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.liked).toBe(false);
    });
  });

  describe('POST /api/tracks/:id/play', () => {
    it('should record a play', async () => {
      const res = await request(app)
        .post(`/api/tracks/${track.id}/play`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Play recorded');
    });
  });

  describe('PUT /api/tracks/:id', () => {
    it('admin should update a track', async () => {
      const res = await request(app)
        .put(`/api/tracks/${track.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Updated Track Name' });

      expect(res.status).toBe(200);
      expect(res.body.track.name).toBe('Updated Track Name');
    });
  });

  describe('DELETE /api/tracks/:id', () => {
    it('admin should delete a track', async () => {
      const newTrack = await createTestTrack(artist.id, album.id, { name: 'To Delete' });
      const res = await request(app)
        .delete(`/api/tracks/${newTrack.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Track deleted successfully');
    });
  });
});
