import { ChainID } from '@stacks/transactions';

import { IS_TEST_ENV } from './environment';

export const gaiaUrl = 'https://hub.blockstack.org';

export const POPUP_CENTER_WIDTH = 442;
export const POPUP_CENTER_HEIGHT = 646;

export const HIGH_FEE_AMOUNT_STX = 5;

export const DEFAULT_FEE_RATE = 400;

export const HUMAN_REACTION_DEBOUNCE_TIME = 200;

export const PERSISTENCE_CACHE_TIME = 1000 * 60 * 60 * 12; // 12 hours

export const STX_DECIMALS = 6;

export const KEBAB_REGEX = /[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g;

export const MICROBLOCKS_ENABLED = !IS_TEST_ENV && true;

export const GITHUB_ORG = 'hirosystems';
export const GITHUB_REPO = 'stacks-wallet-web';

export interface Network {
  url: string;
  name: string;
  chainId: ChainID;
}

export const DEFAULT_TESTNET_SERVER = 'https://stacks-node-api.testnet.stacks.co';

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
  devnet: {
    url: 'http://localhost:3999',
    name: 'Devnet',
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
