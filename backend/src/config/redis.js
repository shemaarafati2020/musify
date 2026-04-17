const Redis = require('ioredis');
const config = require('./index');
const logger = require('./logger');

let redis = null;

function getRedisClient() {
  if (!redis) {
    try {
      redis = new Redis(config.redis.url, {
        maxRetriesPerRequest: 3,
        retryStrategy(times) {
          if (times > 3) {
            logger.warn('Redis connection failed after 3 retries, running without cache');
            return null;
          }
          return Math.min(times * 200, 2000);
        },
        lazyConnect: true,
      });

      redis.on('connect', () => logger.info('Redis connected'));
      redis.on('error', (err) => logger.warn('Redis error:', err.message));
    } catch (err) {
      logger.warn('Redis initialization failed:', err.message);
      redis = null;
    }
  }
  return redis;
}

async function connectRedis() {
  try {
    const client = getRedisClient();
    if (client) {
      await client.connect();
    }
  } catch (err) {
    logger.warn('Redis connect failed, continuing without cache:', err.message);
  }
}

async function disconnectRedis() {
  if (redis) {
    await redis.quit();
    redis = null;
  }
}

module.exports = { getRedisClient, connectRedis, disconnectRedis };
