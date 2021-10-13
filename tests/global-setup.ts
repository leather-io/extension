import { setup } from 'jest-dev-server';

// ts-unused-exports:disable-next-line
export default async function globalSetup() {
  await setup({
    command: 'yarn test:serve',
    launchTimeout: 10000,
    port: 3001,
  });
}
