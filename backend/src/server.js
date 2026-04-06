const app = require('./app');
const config = require('./config');
const logger = require('./config/logger');
const { connectDatabase } = require('./config/database');
const { connectRedis } = require('./config/redis');

async function startServer() {
  try {
    await connectDatabase();
    await connectRedis();

    app.listen(config.port, () => {
      logger.info(`Musify API server running on port ${config.port}`);
      logger.info(`Environment: ${config.nodeEnv}`);
      logger.info(`Health check: http://localhost:${config.port}/health`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  const { disconnectDatabase } = require('./config/database');
  const { disconnectRedis } = require('./config/redis');
  await disconnectDatabase();
  await disconnectRedis();
  process.exit(0);
});

startServer();
