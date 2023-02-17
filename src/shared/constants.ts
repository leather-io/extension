import { ChainID } from '@stacks/transactions';

import { IS_TEST_ENV } from './environment';
import { Blockchains } from './models/blockchain.model';

export const gaiaUrl = 'https://hub.blockstack.org';

export const POPUP_CENTER_WIDTH = 442;
export const POPUP_CENTER_HEIGHT = 646;

export const HIGH_FEE_AMOUNT_STX = 5;

export const DEFAULT_FEE_RATE = 400;

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

interface BaseChainConfig {
  blockchain: Blockchains;
}

interface BitcoinChainConfig extends BaseChainConfig {
  blockchain: 'bitcoin';
  url: string;
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

export const BITCOIN_API_BASE_URL_MAINNET = 'https://blockstream.info/api';
export const BITCOIN_API_BASE_URL_TESTNET = 'https://blockstream.info/testnet/api';

export const BITCOIN_TEST_ADDRESS = '';

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

export enum QueryRefreshRates {
  VERY_SLOW = 120_000,
  SLOW = 30_000,
  MEDIUM = 10_000,
  FAST = 3_500,
}

export const DEFAULT_LIST_LIMIT = 50;

export const CEX_ADDRESSES = [
  'SP1P72Z3704VMT3DMHPP2CB8TGQWGDBHD3RPR9GZS',
  'SP3HXJJMJQ06GNAZ8XWDN1QM48JEDC6PP6W3YZPZJ',
  'SPNBYP1MY456K29804XHT4PY5QKMSXNRBHGADTDY',
  'SP3RFAZMSH6YA1KTJD7DN997AG2DG54E3Z9ZJWYN8',
  'SPX8T06E8FJQ33CX8YVR9CC6D9DSTF6JE0Y8R7DS',
  'SPXJJ6XPRV52JREBENWFX7TG1CFPFP0QS81BDH0A',
  'SP1RWW86QN0KKZYZAZ5K4NJX4BQQCVWVSR7CXW5XA',
  'SP111MNWTSXGTD0ESMV59WX4KHQA93RTV9F82EK0K',
  'SP2VK9TBG8E20A0YW228PC70GBMSBFHE7BNVMKB57',
];
