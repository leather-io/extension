import { useQueries } from '@tanstack/react-query';

import { useConfigRunesEnabled } from '@app/query/common/remote-config/remote-config.query';
import { useBitcoinClient } from '@app/store/common/api-clients.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import type { RuneBalance, RuneTickerInfo } from '../bitcoin-client';
import { createRuneCryptoAssetDetails } from './runes.utils';

const queryOptions = { staleTime: 5 * 60 * 1000 };

export function useGetRunesTickerInfoQuery(runesBalances: RuneBalance[]) {
  const client = useBitcoinClient();
  const network = useCurrentNetwork();
  const runesEnabled = useConfigRunesEnabled();

  return useQueries({
    queries: runesBalances.map(runeBalance => {
      return {
        enabled:
          !runeBalance && (network.chain.bitcoin.bitcoinNetwork === 'testnet' || runesEnabled),
        queryKey: ['runes-ticker-info', runeBalance.rune_name],
        queryFn: () =>
          client.bestinSlotApi.getRunesTickerInfo(
            runeBalance.rune_name,
            network.chain.bitcoin.bitcoinNetwork
          ),
        select: (resp: RuneTickerInfo) => createRuneCryptoAssetDetails(runeBalance, resp),
        ...queryOptions,
      };
    }),
  });
}
