const request = require('supertest');
const app = require('../app');
const { prisma, cleanDatabase, createTestArtist, createTestAlbum, createTestTrack } = require('./setup');

beforeAll(async () => {
  await cleanDatabase();

  const artist = await createTestArtist({ name: 'Search Artist' });
  const album = await createTestAlbum(artist.id, { name: 'Search Album' });
  await createTestTrack(artist.id, album.id, { name: 'Search Track' });
});

afterAll(async () => {
  await cleanDatabase();
  await prisma.$disconnect();
});

describe('Search API', () => {
  describe('GET /api/search', () => {
    it('should search across all types', async () => {
      const res = await request(app).get('/api/search?q=Search');
      expect(res.status).toBe(200);
      expect(res.body.tracks).toBeDefined();
      expect(res.body.artists).toBeDefined();
      expect(res.body.albums).toBeDefined();
      expect(res.body.playlists).toBeDefined();
    });

    it('should search tracks specifically', async () => {
      const res = await request(app).get('/api/search?q=Search&type=tracks');
      expect(res.status).toBe(200);
      expect(res.body.tracks).toBeDefined();
      expect(res.body.tracks.length).toBeGreaterThanOrEqual(1);
    });

    it('should search artists specifically', async () => {
      const res = await request(app).get('/api/search?q=Search&type=artists');
      expect(res.status).toBe(200);
      expect(res.body.artists).toBeDefined();
      expect(res.body.artists.length).toBeGreaterThanOrEqual(1);
    });

    it('should return empty results for no match', async () => {
      const res = await request(app).get('/api/search?q=xyznonexistent');
      expect(res.status).toBe(200);
      expect(res.body.tracks.length).toBe(0);
      expect(res.body.artists.length).toBe(0);
    });

    it('should return empty for blank query', async () => {
      const res = await request(app).get('/api/search?q=');
      expect(res.status).toBe(200);
    });
  });
});
