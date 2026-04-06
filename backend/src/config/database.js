const { PrismaClient } = require('@prisma/client');
const logger = require('./logger');

let prisma;

if (process.env.NODE_ENV === 'test') {
  prisma = new PrismaClient({
    datasources: { db: { url: process.env.DATABASE_URL } },
    log: [],
  });
} else {
  prisma = new PrismaClient({
    log: [
      { emit: 'event', level: 'query' },
      { emit: 'event', level: 'error' },
    ],
  });

  prisma.$on('error', (e) => {
    logger.error('Prisma error:', e);
  });
}

async function connectDatabase() {
  try {
    await prisma.$connect();
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error('Database connection failed:', error);
    process.exit(1);
  }
}

async function disconnectDatabase() {
  await prisma.$disconnect();
  logger.info('Database disconnected');
}

module.exports = { prisma, connectDatabase, disconnectDatabase };
