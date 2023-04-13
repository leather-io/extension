import { ChainID } from '@stacks/transactions';

import { IS_TEST_ENV } from './environment';
import { Blockchains } from './models/blockchain.model';

export const gaiaUrl = 'https://hub.blockstack.org';

export const POPUP_CENTER_WIDTH = 442;
export const POPUP_CENTER_HEIGHT = 646;

export const HIGH_FEE_AMOUNT_STX = 5;
export const HIGH_FEE_WARNING_LEARN_MORE_URL_BTC = 'https://bitcoinfees.earn.com/';
export const HIGH_FEE_WARNING_LEARN_MORE_URL_STX = 'https://hiro.so/questions/fee-estimates';

export const DEFAULT_FEE_RATE = 400;

export const PERSISTENCE_CACHE_TIME = 1000 * 60 * 60 * 12; // 12 hours

export const BTC_DECIMALS = 8;
export const STX_DECIMALS = 6;

export const KEBAB_REGEX = /[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g;

export const MICROBLOCKS_ENABLED = !IS_TEST_ENV && true;

export const GITHUB_ORG = 'hirosystems';
export const GITHUB_REPO = 'wallet';

export enum DefaultNetworkConfigurationIds {
  mainnet = 'mainnet',
  testnet = 'testnet',
  devnet = 'devnet',
}

export type DefaultNetworkConfigurations = keyof typeof DefaultNetworkConfigurationIds;

interface BaseChainConfig {
  blockchain: Blockchains;
}

interface BitcoinChainConfig extends BaseChainConfig {
  blockchain: 'bitcoin';
  url: string;
  network: NetworkModes;
}

interface StacksChainConfig extends BaseChainConfig {
  blockchain: 'stacks';
  url: string;
  chainId: ChainID;
}

export interface NetworkConfiguration {
  name: string;
  id: DefaultNetworkConfigurations;
  chain: {
    bitcoin: BitcoinChainConfig;
    stacks: StacksChainConfig;
  };
}

export enum DefaultNetworkModes {
  mainnet = 'mainnet',
  testnet = 'testnet',
}

export type NetworkModes = keyof typeof DefaultNetworkModes;

const DEFAULT_SERVER_MAINNET = 'https://stacks-node-api.stacks.co';
export const DEFAULT_SERVER_TESTNET = 'https://stacks-node-api.testnet.stacks.co';

export const HIRO_API_BASE_URL_MAINNET = 'https://api.hiro.so';
export const HIRO_API_BASE_URL_TESTNET = 'https://api.testnet.hiro.so';

export const BITCOIN_API_BASE_URL_MAINNET = 'https://blockstream.info/api';
export const BITCOIN_API_BASE_URL_TESTNET = 'https://blockstream.info/testnet/api';

const networkMainnet: NetworkConfiguration = {
  id: DefaultNetworkConfigurationIds.mainnet,
  name: 'Mainnet',
  chain: {
    stacks: {
      blockchain: 'stacks',
      chainId: ChainID.Mainnet,
      url: DEFAULT_SERVER_MAINNET,
    },
    bitcoin: {
      blockchain: 'bitcoin',
      network: 'mainnet',
      url: BITCOIN_API_BASE_URL_MAINNET,
    },
  },
};

const networkTestnet: NetworkConfiguration = {
  id: DefaultNetworkConfigurationIds.testnet,
  name: 'Testnet',
  chain: {
    stacks: {
      blockchain: 'stacks',
      chainId: ChainID.Testnet,
      url: DEFAULT_SERVER_TESTNET,
    },
    bitcoin: {
      blockchain: 'bitcoin',
      network: 'testnet',
      url: BITCOIN_API_BASE_URL_TESTNET,
    },
  },
};

const networkDevnet: NetworkConfiguration = {
  id: DefaultNetworkConfigurationIds.devnet,
  name: 'Devnet',
  chain: {
    stacks: {
      blockchain: 'stacks',
      chainId: ChainID.Testnet,
      url: 'http://localhost:3999',
    },
    bitcoin: {
      blockchain: 'bitcoin',
      network: 'testnet',
      url: BITCOIN_API_BASE_URL_TESTNET,
    },
  },
};

export const defaultCurrentNetwork: NetworkConfiguration = networkMainnet;

export const defaultNetworksKeyedById: Record<
  DefaultNetworkConfigurationIds,
  NetworkConfiguration
> = {
  [DefaultNetworkConfigurationIds.mainnet]: networkMainnet,
  [DefaultNetworkConfigurationIds.testnet]: networkTestnet,
  [DefaultNetworkConfigurationIds.devnet]: networkDevnet,
};

export const DEFAULT_LIST_LIMIT = 50;
