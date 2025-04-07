import PQueue from 'p-queue';

import { hiroStacksMainnetApiLimiter, hiroStacksTestnetApiLimiter } from '@leather.io/query';
import { assertUnreachable } from '@leather.io/utils';

import { useCurrentNetworkState } from '../leather-query-provider';

export function useHiroApiRateLimiter(): PQueue {
  const currentNetwork = useCurrentNetworkState();

  switch (currentNetwork.mode) {
    case 'mainnet':
      return hiroStacksMainnetApiLimiter;
    case 'testnet':
      return hiroStacksTestnetApiLimiter;
    default:
      assertUnreachable(currentNetwork.mode);
  }
}
