import { useQueries } from '@tanstack/react-query';

import { isDefined } from '@shared/utils';

import { useBitcoinClient } from '@app/store/common/api-clients.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import type { RuneBalance, RuneTickerInfo } from '../bitcoin-client';
import { useRunesEnabled } from './runes.hooks';
import { createRuneCryptoAssetDetails } from './runes.utils';

const queryOptions = { staleTime: 5 * 60 * 1000 };

export function useGetRunesTickerInfoQuery(runesBalances: RuneBalance[]) {
  const client = useBitcoinClient();
  const network = useCurrentNetwork();
  const runesEnabled = useRunesEnabled();

  return useQueries({
    queries: runesBalances.map(runeBalance => {
      return {
        enabled: isDefined(runeBalance) && runesEnabled,
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
