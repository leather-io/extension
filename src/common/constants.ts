import { ChainID } from '@stacks/transactions';

export const gaiaUrl = 'https://hub.blockstack.org';

export const HIGH_FEE_AMOUNT_STX = 5;

export const HUMAN_REACTION_DEBOUNCE_TIME = 250;

export const STX_TRANSFER_TX_SIZE_BYTES = 180;

export const USERNAMES_ENABLED = process.env.USERNAMES_ENABLED === 'true';

export const IS_TEST_ENV = process.env.TEST_ENV === 'true';

export const PERSISTENCE_CACHE_TIME = 1000 * 60 * 60 * 12; // 12 hours

export const STX_DECIMALS = 6;

export const KEBAB_REGEX = /[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g;

export const POPUP_WIDTH = 442;
export const POPUP_HEIGHT = 646;
export const MICROBLOCKS_ENABLED = !IS_TEST_ENV && true;

export const GITHUB_ORG = 'blockstack';
export const GITHUB_REPO = 'stacks-wallet-web';
export const GITHUB_PRIMARY_BRANCH = 'main';

export interface Network {
  url: string;
  name: string;
  chainId: ChainID;
}

const DEFAULT_TESTNET_SERVER = 'https://stacks-node-api.testnet.stacks.co';

const DEFAULT_REGTEST_SERVER = 'https://stacks-node-api.regtest.stacks.co';

const DEFAULT_MAINNET_SERVER = 'https://stacks-node-api.stacks.co';

export type Networks = Record<string, Network>;

export const defaultNetworks: Networks = {
  mainnet: {
    url: DEFAULT_MAINNET_SERVER,
    name: 'Mainnet',
    chainId: ChainID.Mainnet,
  },
  testnet: {
    url: DEFAULT_TESTNET_SERVER,
    name: 'Testnet',
    chainId: ChainID.Testnet,
  },
  regtest: {
    url: DEFAULT_REGTEST_SERVER,
    name: 'Regtest',
    chainId: ChainID.Testnet,
  },
  localnet: {
    url: 'http://localhost:3999',
    name: 'Localnet',
    chainId: ChainID.Testnet,
  },
} as const;

export enum QueryRefreshRates {
  VERY_SLOW = 120_000,
  SLOW = 30_000,
  MEDIUM = 10_000,
  FAST = 3_500,
}

export const DEFAULT_LIST_LIMIT = 50;
