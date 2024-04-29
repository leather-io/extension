import { useQueries } from '@tanstack/react-query';

import { useConfigRunesEnabled } from '@app/query/common/remote-config/remote-config.query';
import type { AppUseQueryConfig } from '@app/query/query-config';
import { useBitcoinClient } from '@app/store/common/api-clients.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import type { RuneBalance } from '../bitcoin-client';

const queryOptions = { staleTime: 5 * 60 * 1000 };

export function useGetRunesWalletBalancesByAddressesQuery<T extends unknown = RuneBalance[]>(
  addresses: string[],
  options?: AppUseQueryConfig<RuneBalance[], T>
) {
  const client = useBitcoinClient();
  const network = useCurrentNetwork();
  const runesEnabled = useConfigRunesEnabled();

  return useQueries({
    queries: addresses.map(address => {
      return {
        enabled: !!address && (network.chain.bitcoin.bitcoinNetwork === 'testnet' || runesEnabled),
        queryKey: ['runes-wallet-balances', address],
        queryFn: () =>
          client.BestinslotApi.getRunesWalletBalances(
            address,
            network.chain.bitcoin.bitcoinNetwork
          ),
        ...queryOptions,
        ...options,
      };
    }),
  });
}
