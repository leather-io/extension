import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: 'src/**/*.spec.{ts,tsx}',
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json-summary', 'json', 'html'],
      reportsDirectory: './coverage',
    },
    globals: true,
    environment: 'node',
    setupFiles: './tests/unit/unit-test.setup.js',
    deps: { interopDefault: true },
    silent: false,
  },
  resolve: {
    alias: {
      '@shared': path.resolve('./src/shared'),
      '@background': path.resolve('./src/background'),
      '@content-scripts': path.resolve('./src/content-scripts'),
      '@inpage': path.resolve('./src/inpage'),
      '@app': path.resolve('./src/app'),
      '@tests': path.resolve('./tests'),
    },
  },
});
