import { teardown } from 'jest-dev-server';

// ts-unused-exports:disable-next-line
export default async function globalTeardown() {
  await teardown();
}
