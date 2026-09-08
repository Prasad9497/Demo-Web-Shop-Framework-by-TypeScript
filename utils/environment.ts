import path from 'node:path';
import dotenv from 'dotenv';

// Select the environment with TEST_ENV=dev, TEST_ENV=stg, or TEST_ENV=prod.
const environmentName = (process.env.TEST_ENV ?? 'dev').toLowerCase();
const environmentFile = path.resolve(process.cwd(), `.env.${environmentName}`);
dotenv.config({ path: environmentFile });

export const environment = {
  name: environmentName,
  baseUrl: process.env.BASE_URL ?? 'https://demowebshop.tricentis.com',
};