import {
  HIRO_MAINNET_DEFAULT,
  HIRO_MOCKNET_DEFAULT,
  HIRO_TESTNET_DEFAULT,
  StacksMainnet,
  StacksMocknet,
  StacksTestnet,
} from 'micro-stacks/network';

import { DefaultNetworkConfigurations } from '@shared/constants';

export function getStacksNetwork(network: DefaultNetworkConfigurations = 'testnet') {
  switch (network) {
    case 'mainnet':
      return new StacksMainnet({
        url: HIRO_MAINNET_DEFAULT,
      });

    case 'testnet':
      return new StacksTestnet({
        url: HIRO_TESTNET_DEFAULT,
      });

    default:
      return new StacksMocknet({
        url: HIRO_MOCKNET_DEFAULT,
      });
  }
}
