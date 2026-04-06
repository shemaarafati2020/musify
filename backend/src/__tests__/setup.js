const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function cleanDatabase() {
  const tablenames = await prisma.$queryRaw`
    SELECT tablename FROM pg_tables WHERE schemaname='public'
  `;
  for (const { tablename } of tablenames) {
    if (tablename !== '_prisma_migrations') {
      try {
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE "public"."${tablename}" CASCADE;`);
      } catch (e) {
        // ignore
      }
    }
  }
}

async function createTestUser(overrides = {}) {
  const password = await bcrypt.hash(overrides.password || 'testpass123', 12);
  return prisma.user.create({
    data: {
      email: overrides.email || `test-${Date.now()}@test.com`,
      username: overrides.username || `testuser-${Date.now()}`,
      password,
      role: overrides.role || 'user',
      avatar: 'https://example.com/avatar.png',
      ...overrides,
      password, // ensure hash
    },
  });
}

async function createTestArtist(overrides = {}) {
  return prisma.artist.create({
    data: {
      name: overrides.name || `Test Artist ${Date.now()}`,
      imageUrl: 'https://example.com/artist.png',
      followers: 1000,
      ...overrides,
    },
  });
}

async function createTestAlbum(artistId, overrides = {}) {
  return prisma.album.create({
    data: {
      name: overrides.name || `Test Album ${Date.now()}`,
      artistId,
      imageUrl: 'https://example.com/album.png',
      releaseDate: '2024',
      ...overrides,
    },
  });
}

async function createTestTrack(artistId, albumId, overrides = {}) {
  return prisma.track.create({
    data: {
      name: overrides.name || `Test Track ${Date.now()}`,
      artistId,
      albumId,
      duration: 200,
      imageUrl: 'https://example.com/track.png',
      ...overrides,
    },
  });
}

module.exports = {
  prisma,
  cleanDatabase,
  createTestUser,
  createTestArtist,
  createTestAlbum,
  createTestTrack,
};
