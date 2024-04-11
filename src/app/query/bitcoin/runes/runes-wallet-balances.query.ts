import { useQuery } from '@tanstack/react-query';

import { useConfigRunesEnabled } from '@app/query/common/remote-config/remote-config.query';
import type { AppUseQueryConfig } from '@app/query/query-config';
import { useBitcoinClient } from '@app/store/common/api-clients.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import type { RuneBalance } from '../bitcoin-client';

export function useGetRunesWalletBalancesQuery<T extends unknown = RuneBalance[]>(
  address: string,
  options?: AppUseQueryConfig<RuneBalance[], T>
) {
  const client = useBitcoinClient();
  const network = useCurrentNetwork();
  const runesEnabled = useConfigRunesEnabled();

  return useQuery({
    enabled: !!address && (network.chain.bitcoin.bitcoinNetwork === 'testnet' || runesEnabled),
    queryKey: ['runes-wallet-balances', address],
    queryFn: () =>
      client.BestinslotApi.getRunesWalletBalances(address, network.chain.bitcoin.bitcoinNetwork),
    ...options,
  });
}
