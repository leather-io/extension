export const BRANCH = process.env.GITHUB_REF;
export const BRANCH_NAME = process.env.GITHUB_HEAD_REF ?? process.env.BRANCH_NAME;
export const PR_NUMBER = process.env.PR_NUMBER;
export const COINBASE_APP_ID = process.env.COINBASE_APP_ID ?? '';
export const COMMIT_SHA = process.env.COMMIT_SHA;
// ts-unused-exports:disable-next-line
export const IS_DEV_ENV = process.env.WALLET_ENVIRONMENT === 'development';
export const IS_TEST_ENV = process.env.WALLET_ENVIRONMENT === 'testing';
export const MOONPAY_API_KEY = process.env.MOONPAY_API_KEY ?? '';
export const SEGMENT_WRITE_KEY = process.env.SEGMENT_WRITE_KEY ?? '';
export const SENTRY_DSN = process.env.SENTRY_DSN ?? '';
export const TRANSAK_API_KEY = process.env.TRANSAK_API_KEY ?? '';
export const WALLET_ENVIRONMENT = process.env.WALLET_ENVIRONMENT ?? 'unknown';

// ts-unused-exports:disable-next-line
export const SWAP_ENABLED = process.env.SWAP_ENABLED === 'true';
export const BITFLOW_API_HOST = process.env.BITFLOW_API_HOST ?? '';
export const BITFLOW_API_KEY = process.env.BITFLOW_API_KEY ?? '';
export const BITFLOW_STACKS_API_HOST = process.env.BITFLOW_STACKS_API_HOST ?? '';
export const BITFLOW_READONLY_CALL_API_HOST = process.env.BITFLOW_READONLY_CALL_API_HOST ?? '';
export const DEBUG_TX_MONITOR = process.env.DEBUG_TX_MONITOR === 'true';
