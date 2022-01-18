const config = require('./jest.config');

module.exports = {
  ...config,
  testTimeout: 60000,
  globalSetup: '<rootDir>/tests/global-setup.ts',
  globalTeardown: '<rootDir>/tests/global-teardown.ts',
};
