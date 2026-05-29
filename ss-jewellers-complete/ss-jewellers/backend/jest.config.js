// jest.config.js
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js', '**/*.spec.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/__tests__/**',
    '!src/utils/seed.js',
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  coverageDirectory: 'coverage',
  setupFilesAfterFramework: [],
  testTimeout: 30000,
  verbose: true,
  forceExit: true,
  clearMocks: true,
};
