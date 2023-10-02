import dotenv from 'dotenv';

export default async function globalSetup() {
  dotenv.config({
    path: '.env',
    override: true,
  });
}
