import { setup } from 'jest-dev-server';

// ts-unused-exports:disable-next-line
export default async function globalSetup() {
  await setup({
    command: 'yarn dev:test-app',
    launchTimeout: 15000,
    port: 3000,
  });
}
