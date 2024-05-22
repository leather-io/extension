import { useMemo } from 'react';

import { isDefined } from '@shared/utils';

import { useConfigRunesEnabled } from '@app/query/common/remote-config/remote-config.query';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { useGetRunesOutputsByAddressQuery } from './runes-outputs-by-address.query';
import { useGetRunesTickerInfoQuery } from './runes-ticker-info.query';
import { useGetRunesWalletBalancesByAddressesQuery } from './runes-wallet-balances.query';

export function useRunesEnabled() {
  const runesEnabled = useConfigRunesEnabled();
  const network = useCurrentNetwork();

  return runesEnabled || network.chain.bitcoin.bitcoinNetwork === 'testnet';
}

export function useRuneTokens(addresses: string[]) {
  const runesBalances = useGetRunesWalletBalancesByAddressesQuery(addresses)
    .flatMap(query => query.data)
    .filter(isDefined);

  const results = useGetRunesTickerInfoQuery(runesBalances);

  return useMemo(() => {
    // We can potentially use the 'combine' option in react-query v5 to replace this?
    // https://tanstack.com/query/latest/docs/framework/react/reference/useQueries#combine
    const isInitialLoading = results.some(query => query.isInitialLoading);
    const runes = results.map(query => query.data).filter(isDefined);

    return { isInitialLoading, runes };
  }, [results]);
}

export function useRunesOutputsByAddress(address: string) {
  return useGetRunesOutputsByAddressQuery(address);
}
