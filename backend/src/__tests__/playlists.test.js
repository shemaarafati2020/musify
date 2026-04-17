const request = require('supertest');
const app = require('../app');
const { prisma, cleanDatabase, createTestUser, createTestArtist, createTestAlbum, createTestTrack } = require('./setup');

let userToken, user, artist, album, track, playlistId;

beforeAll(async () => {
  await cleanDatabase();

  user = await createTestUser({
    email: 'user@playlist-test.com',
    username: 'playlistuser',
    password: 'user123',
    role: 'user',
  });

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'user@playlist-test.com', password: 'user123' });
  userToken = loginRes.body.accessToken;

  artist = await createTestArtist({ name: 'Playlist Artist' });
  album = await createTestAlbum(artist.id, { name: 'Playlist Album' });
  track = await createTestTrack(artist.id, album.id, { name: 'Playlist Track' });
});

afterAll(async () => {
  await cleanDatabase();
  await prisma.$disconnect();
});

describe('Playlists API', () => {
  describe('POST /api/playlists', () => {
    it('should create a playlist', async () => {
      const res = await request(app)
        .post('/api/playlists')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'My Playlist',
          description: 'A test playlist',
        });

      expect(res.status).toBe(201);
      expect(res.body.playlist.name).toBe('My Playlist');
      expect(res.body.playlist.owner.id).toBe(user.id);
      playlistId = res.body.playlist.id;
    });

    it('should reject unauthenticated request', async () => {
      const res = await request(app)
        .post('/api/playlists')
        .send({ name: 'No Auth Playlist' });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/playlists', () => {
    it('should list public playlists', async () => {
      const res = await request(app).get('/api/playlists');
      expect(res.status).toBe(200);
      expect(res.body.playlists).toBeDefined();
    });
  });

  describe('GET /api/playlists/mine', () => {
    it('should list user playlists', async () => {
      const res = await request(app)
        .get('/api/playlists/mine')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.playlists.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('GET /api/playlists/:id', () => {
    it('should get playlist by id', async () => {
      const res = await request(app).get(`/api/playlists/${playlistId}`);
      expect(res.status).toBe(200);
      expect(res.body.playlist.name).toBe('My Playlist');
    });
  });

  describe('POST /api/playlists/:id/tracks', () => {
    it('should add track to playlist', async () => {
      const res = await request(app)
        .post(`/api/playlists/${playlistId}/tracks`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ trackId: track.id });

      expect(res.status).toBe(201);
      expect(res.body.playlistTrack.track).toBeDefined();
    });

    it('should reject duplicate track', async () => {
      const res = await request(app)
        .post(`/api/playlists/${playlistId}/tracks`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ trackId: track.id });

      expect(res.status).toBe(409);
    });
  });

  describe('DELETE /api/playlists/:id/tracks/:trackId', () => {
    it('should remove track from playlist', async () => {
      const res = await request(app)
        .delete(`/api/playlists/${playlistId}/tracks/${track.id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
    });
  });

  describe('PUT /api/playlists/:id', () => {
    it('should update playlist', async () => {
      const res = await request(app)
        .put(`/api/playlists/${playlistId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Updated Playlist', description: 'Updated description' });

      expect(res.status).toBe(200);
      expect(res.body.playlist.name).toBe('Updated Playlist');
    });
  });

  describe('DELETE /api/playlists/:id', () => {
    it('should delete playlist', async () => {
      const res = await request(app)
        .delete(`/api/playlists/${playlistId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Playlist deleted successfully');
    });
  });
});
