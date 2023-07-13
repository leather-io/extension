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

// https://bitcoin.stackexchange.com/a/41082/139277
export const BTC_P2WPKH_DUST_AMOUNT = 294;

export const KEBAB_REGEX = /[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g;

export const MICROBLOCKS_ENABLED = !IS_TEST_ENV && true;

export const GITHUB_ORG = 'hirosystems';
export const GITHUB_REPO = 'wallet';

export enum WalletDefaultNetworkConfigurationIds {
  mainnet = 'mainnet',
  testnet = 'testnet',
  signet = 'signet',
  devnet = 'devnet',
}

export type DefaultNetworkConfigurations = keyof typeof WalletDefaultNetworkConfigurationIds;

const networkModes = ['mainnet', 'testnet'] as const;

export type NetworkModes = (typeof networkModes)[number];

type BitcoinTestnetModes = 'testnet' | 'regtest' | 'signet';

export type BitcoinNetworkModes = NetworkModes | BitcoinTestnetModes;

interface BaseChainConfig {
  blockchain: Blockchains;
}

interface BitcoinChainConfig extends BaseChainConfig {
  blockchain: 'bitcoin';
  url: string;
  network: BitcoinNetworkModes;
}

interface StacksChainConfig extends BaseChainConfig {
  blockchain: 'stacks';
  url: string;
  /** The chainId of the network (or parent network if this is a subnet) */
  chainId: ChainID;
  /** An additional chainId for subnets. Indicated a subnet if defined and is mainly used for signing */
  subnetChainId?: ChainID;
}

export interface NetworkConfiguration {
  name: string;
  id: DefaultNetworkConfigurations;
  chain: {
    bitcoin: BitcoinChainConfig;
    stacks: StacksChainConfig;
  };
}

export const HIRO_API_BASE_URL_MAINNET = 'https://api.hiro.so';
export const HIRO_API_BASE_URL_TESTNET = 'https://api.testnet.hiro.so';

export const BITCOIN_API_BASE_URL_MAINNET = 'https://blockstream.info/api';
export const BITCOIN_API_BASE_URL_TESTNET = 'https://blockstream.info/testnet/api';
export const BITCOIN_API_BASE_URL_SIGNET = 'https://mempool.space/signet/api';

const networkMainnet: NetworkConfiguration = {
  id: WalletDefaultNetworkConfigurationIds.mainnet,
  name: 'Mainnet',
  chain: {
    stacks: {
      blockchain: 'stacks',
      chainId: ChainID.Mainnet,
      url: HIRO_API_BASE_URL_MAINNET,
    },
    bitcoin: {
      blockchain: 'bitcoin',
      network: 'mainnet',
      url: BITCOIN_API_BASE_URL_MAINNET,
    },
  },
};

const networkTestnet: NetworkConfiguration = {
  id: WalletDefaultNetworkConfigurationIds.testnet,
  name: 'Testnet',
  chain: {
    stacks: {
      blockchain: 'stacks',
      chainId: ChainID.Testnet,
      url: HIRO_API_BASE_URL_TESTNET,
    },
    bitcoin: {
      blockchain: 'bitcoin',
      network: 'testnet',
      url: BITCOIN_API_BASE_URL_TESTNET,
    },
  },
};

const networkSignet: NetworkConfiguration = {
  id: WalletDefaultNetworkConfigurationIds.signet,
  name: 'Signet',
  chain: {
    stacks: {
      blockchain: 'stacks',
      chainId: ChainID.Testnet,
      url: HIRO_API_BASE_URL_TESTNET,
    },
    bitcoin: {
      blockchain: 'bitcoin',
      network: 'signet',
      url: BITCOIN_API_BASE_URL_SIGNET,
    },
  },
};

const networkDevnet: NetworkConfiguration = {
  id: WalletDefaultNetworkConfigurationIds.devnet,
  name: 'Devnet',
  chain: {
    stacks: {
      blockchain: 'stacks',
      chainId: ChainID.Testnet,
      url: 'http://localhost:3999',
    },
    bitcoin: {
      blockchain: 'bitcoin',
      network: 'regtest',
      url: 'http://localhost:18443',
    },
  },
};

export const defaultCurrentNetwork: NetworkConfiguration = networkMainnet;

export const defaultNetworksKeyedById: Record<
  WalletDefaultNetworkConfigurationIds,
  NetworkConfiguration
> = {
  [WalletDefaultNetworkConfigurationIds.mainnet]: networkMainnet,
  [WalletDefaultNetworkConfigurationIds.testnet]: networkTestnet,
  [WalletDefaultNetworkConfigurationIds.signet]: networkSignet,
  [WalletDefaultNetworkConfigurationIds.devnet]: networkDevnet,
};

export const DEFAULT_LIST_LIMIT = 50;
