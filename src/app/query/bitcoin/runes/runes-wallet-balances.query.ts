import { useQueries } from '@tanstack/react-query';

import { createGetRunesWalletBalancesByAddressesQueryOptions } from '@leather.io/query';

import { useConfigRunesEnabled } from '@app/query/common/remote-config/remote-config.query';
import { useLeatherNetwork } from '@app/query/leather-query-provider';
import { useBestInSlotApiRateLimiter } from '@app/query/rate-limiter/best-in-slot-limiter';

import { useBitcoinClient } from '../clients/bitcoin-client';

export function useGetRunesWalletBalancesByAddressesQuery(addresses: string[]) {
  const client = useBitcoinClient();
  const network = useLeatherNetwork();
  const runesEnabled = useConfigRunesEnabled();
  const limiter = useBestInSlotApiRateLimiter();

  return useQueries({
    queries: addresses.map(address => {
      return createGetRunesWalletBalancesByAddressesQueryOptions({
        address,
        client,
        network,
        runesEnabled,
        limiter,
      });
    }),
  });
}
