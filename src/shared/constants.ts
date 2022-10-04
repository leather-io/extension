import { ChainID } from '@stacks/transactions';

import { IS_TEST_ENV } from './environment';

export const gaiaUrl = 'https://hub.blockstack.org';

export const POPUP_CENTER_WIDTH = 442;
export const POPUP_CENTER_HEIGHT = 646;

export const HIGH_FEE_AMOUNT_STX = 5;

export const DEFAULT_FEE_RATE = 400;

export const HUMAN_REACTION_DEBOUNCE_TIME = 200;

export const PERSISTENCE_CACHE_TIME = 1000 * 60 * 60 * 12; // 12 hours

export const BTC_DECIMALS = 8;
export const STX_DECIMALS = 6;

export const KEBAB_REGEX = /[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g;

export const MICROBLOCKS_ENABLED = !IS_TEST_ENV && true;

export const GITHUB_ORG = 'hirosystems';
export const GITHUB_REPO = 'stacks-wallet-web';

export enum DefaultNetworkConfigurationIds {
  mainnet = 'mainnet',
  testnet = 'testnet',
  devnet = 'devnet',
}

export type DefaultNetworkConfigurations = keyof typeof DefaultNetworkConfigurationIds;

export interface NetworkConfiguration {
  chainId: ChainID;
  id: DefaultNetworkConfigurations;
  name: string;
  url: string;
}

export enum DefaultNetworkModes {
  mainnet = 'mainnet',
  testnet = 'testnet',
}

export type NetworkModes = keyof typeof DefaultNetworkModes;

const DEFAULT_SERVER_MAINNET = 'https://stacks-node-api.stacks.co';
export const DEFAULT_SERVER_TESTNET = 'https://stacks-node-api.testnet.stacks.co';

export const BITCOIN_API_BASE_URL_MAINNET = 'https://blockstream.info/api';
export const BITCOIN_API_BASE_URL_TESTNET = 'https://blockstream.info/testnet/api';

export const defaultCurrentNetwork = {
  chainId: ChainID.Mainnet,
  id: DefaultNetworkConfigurationIds.mainnet,
  name: 'Mainnet',
  url: DEFAULT_SERVER_MAINNET,
} as const;

export const defaultNetworksKeyedById = {
  [DefaultNetworkConfigurationIds.mainnet]: defaultCurrentNetwork,
  [DefaultNetworkConfigurationIds.testnet]: {
    chainId: ChainID.Testnet,
    id: DefaultNetworkConfigurationIds.testnet,
    name: 'Testnet',
    url: DEFAULT_SERVER_TESTNET,
  },
  [DefaultNetworkConfigurationIds.devnet]: {
    chainId: ChainID.Testnet,
    id: DefaultNetworkConfigurationIds.devnet,
    name: 'Devnet',
    url: 'http://localhost:3999',
  },
};

export enum QueryRefreshRates {
  VERY_SLOW = 120_000,
  SLOW = 30_000,
  MEDIUM = 10_000,
  FAST = 3_500,
}

export const DEFAULT_LIST_LIMIT = 50;
