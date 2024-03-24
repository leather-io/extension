import { ChainID } from '@stacks/transactions';
import PQueue from 'p-queue';

import { whenStacksChainId } from '@app/common/utils';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

const hiroStacksMainnetApiLimiter = new PQueue({
  interval: 5000,
  intervalCap: 10,
  timeout: 60000,
});

const hiroStacksTestnetApiLimiter = new PQueue({
  concurrency: 20,
  interval: 60000,
  intervalCap: 20,
  timeout: 60000,
});

export function useHiroApiRateLimiter() {
  const currentNetwork = useCurrentNetworkState();

  return whenStacksChainId(currentNetwork.chain.stacks.chainId)({
    [ChainID.Mainnet]: hiroStacksMainnetApiLimiter,
    [ChainID.Testnet]: hiroStacksTestnetApiLimiter,
  });
}
