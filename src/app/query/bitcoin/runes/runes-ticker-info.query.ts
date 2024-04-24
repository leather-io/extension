import { type UseQueryResult, useQueries } from '@tanstack/react-query';

import { useConfigRunesEnabled } from '@app/query/common/remote-config/remote-config.query';
import { useBitcoinClient } from '@app/store/common/api-clients.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import type { RuneTickerInfo } from '../bitcoin-client';

const queryOptions = { staleTime: 5 * 60 * 1000 };

export function useGetRunesTickerInfoQuery(runeNames: string[]): UseQueryResult<RuneTickerInfo>[] {
  const client = useBitcoinClient();
  const network = useCurrentNetwork();
  const runesEnabled = useConfigRunesEnabled();

  return useQueries({
    queries: runeNames.map(runeName => {
      return {
        enabled: !!runeName && (network.chain.bitcoin.bitcoinNetwork === 'testnet' || runesEnabled),
        queryKey: ['runes-ticker-info', runeName],
        queryFn: () =>
          client.BestinslotApi.getRunesTickerInfo(runeName, network.chain.bitcoin.bitcoinNetwork),
        ...queryOptions,
      };
    }),
  });
}
