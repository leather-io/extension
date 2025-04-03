import { useQuery } from '@tanstack/react-query';

import { createGetRunesOutputsByAddressQueryOptions } from '@leather.io/query';

import { useLeatherNetwork } from '@app/query/leather-query-provider';
import { useBestInSlotApiRateLimiter } from '@app/query/rate-limiter/best-in-slot-limiter';

import { useBitcoinClient } from '../clients/bitcoin-client';
import { useRunesEnabled } from './runes.hooks';

export function useGetRunesOutputsByAddressQuery(address: string) {
  const client = useBitcoinClient();
  const network = useLeatherNetwork();
  const runesEnabled = useRunesEnabled();
  const limiter = useBestInSlotApiRateLimiter();

  return useQuery(
    createGetRunesOutputsByAddressQueryOptions({
      address,
      client,
      limiter,
      network: network.chain.bitcoin.mode,
      runesEnabled,
    })
  );
}
