import { isString } from './utils';

export function parseEnvVar(value: unknown) {
  if (!isString(value)) return undefined;
  if (value === 'true') return true;
  if (value === 'false') return false;
  return value;
}

export const BITCOIN_ENABLED = parseEnvVar(process.env.BITCOIN_ENABLED);
export const BRANCH = parseEnvVar(process.env.GITHUB_REF);
export const BRANCH_NAME = parseEnvVar(process.env.GITHUB_HEAD_REF);
export const COINBASE_APP_ID = parseEnvVar(process.env.COINBASE_APP_ID ?? '');
export const COMMIT_SHA = parseEnvVar(process.env.GITHUB_SHA);
export const IS_DEV_ENV = parseEnvVar(process.env.WALLET_ENVIRONMENT === 'development');
export const MOONPAY_API_KEY = parseEnvVar(process.env.MOONPAY_API_KEY ?? '');
export const IS_TEST_ENV = parseEnvVar(process.env.TEST_ENV === 'true');
export const SEGMENT_WRITE_KEY = parseEnvVar(process.env.SEGMENT_WRITE_KEY ?? '');
export const TRANSAK_API_KEY = parseEnvVar(process.env.TRANSAK_API_KEY ?? '');
