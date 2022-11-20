const config = require('./jest.config');

module.exports = {
  ...config,
  // Transform options not needed for integration spec
  transform: {
    '^.+\\.tsx?$': '@swc-node/jest',
  },
  testTimeout: 60000,
  globalSetup: '<rootDir>/tests-legacy/global-setup.ts',
  globalTeardown: '<rootDir>/tests-legacy/global-teardown.ts',
};
