module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js', '**/*.test.js'],
  setupFilesAfterSetup: [],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/config/logger.js',
  ],
  coverageDirectory: 'coverage',
  verbose: true,
  testTimeout: 30000,
};
