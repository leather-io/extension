import { useMemo } from 'react';

import { bitcoinNetworkToNetworkMode } from '@leather.io/models';
import { isDefined } from '@leather.io/utils';

import { useConfigRunesEnabled } from '@app/query/common/remote-config/remote-config.query';
import { useLeatherNetwork } from '@app/query/leather-query-provider';

import { useGetRunesOutputsByAddressQuery } from './runes-outputs-by-address.query';
import { useGetRunesTickerInfoQuery } from './runes-ticker-info.query';
import { useGetRunesWalletBalancesByAddressesQuery } from './runes-wallet-balances.query';

export function useRunesEnabled() {
  const runesEnabled = useConfigRunesEnabled();
  const network = useLeatherNetwork();

  return (
    runesEnabled || bitcoinNetworkToNetworkMode(network.chain.bitcoin.bitcoinNetwork) === 'testnet'
  );
}

export function useRuneTokens(addresses: string[]) {
  const runesBalances = useGetRunesWalletBalancesByAddressesQuery(addresses)
    .flatMap(query => query.data)
    .filter(isDefined);

  const results = useGetRunesTickerInfoQuery(runesBalances);

  return useMemo(() => {
    const isLoading = results.some(query => query.isLoading);
    const runes = results.map(query => query.data).filter(isDefined);

    return { isLoading, runes };
  }, [results]);
}

export function useRunesOutputsByAddress(address: string) {
  return useGetRunesOutputsByAddressQuery(address);
}
