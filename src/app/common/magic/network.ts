import { networks as BitcoinNetworks } from 'bitcoinjs-lib';

import type { DefaultNetworkConfigurations } from '@shared/constants';

export function getBitcoinNetwork(network: DefaultNetworkConfigurations = 'testnet') {
  switch (network) {
    case 'mainnet':
      return BitcoinNetworks.bitcoin;

    case 'testnet':
      return BitcoinNetworks.testnet;

    default:
      return BitcoinNetworks.regtest;
  }
}
