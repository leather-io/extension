import { useEffect } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';

import type { WalletDefaultNetworkConfigurationIds } from '@leather.io/models';
import { createGetInscriptionsByAddressCacheKey } from '@leather.io/query';

import { useLeatherNetwork } from '@app/query/leather-query-provider';
import { useBestInSlotApiRateLimiter } from '@app/query/rate-limiter/best-in-slot-limiter';

import { useBitcoinClient } from '../clients/bitcoin-client';

const bestinslotInscriptionsRequestNum = 2000;

export function useGetInscriptionsByAddressQuery(address: string) {
  const network = useLeatherNetwork();
  const client = useBitcoinClient();
  const limiter = useBestInSlotApiRateLimiter();

  const query = useInfiniteQuery({
    enabled: !!address,
    queryKey: createGetInscriptionsByAddressCacheKey(address, network.id),
    async queryFn({ pageParam, signal }) {
      const res = await limiter.add(
        () =>
          client.BestInSlotApi.getInscriptionsByAddress({
            address,
            network: network.id as WalletDefaultNetworkConfigurationIds,
            offset: pageParam,
            signal,
            count: bestinslotInscriptionsRequestNum,
          }),
        { signal, throwOnTimeout: true }
      );

      return {
        offset: pageParam,
        data: res.data,
      };
    },
    initialPageParam: 0,
    getNextPageParam(lastPage) {
      if (!address) return undefined;
      if (lastPage.data.length < bestinslotInscriptionsRequestNum) return undefined;
      return lastPage.offset + bestinslotInscriptionsRequestNum;
    },
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: 3 * 60 * 1000,
  });

  // Auto-trigger next request
  useEffect(() => {
    if (!address) return;
    void query.fetchNextPage();
  }, [address, query, query.data]);

  return query;
}
