const config = require('./jest.config');

module.exports = {
  ...config,
  // Transform options not needed for integration spec
  transform: {
    '^.+\\.tsx?$': '@swc-node/jest',
  },
  testTimeout: 60000,
  globalSetup: '<rootDir>/tests/global-setup.ts',
  globalTeardown: '<rootDir>/tests/global-teardown.ts',
};
