import { useQuery } from '@tanstack/react-query';

import { AppUseQueryConfig } from '@app/query/query-config';
import { QueryPrefixes } from '@app/query/query-prefixes';

export interface Stamp {
  asset: string;
  block_index: number;
  message_index: number;
  stamp: number;
  stamp_mimetype: string;
  stamp_url: string;
  timestamp: number;
  tx_hash: string;
  tx_index: number;
}

async function fetchStampCollection() {
  return (
    fetch('https://stampchain.io/stamp.json')
      .then(res => res.json())
      // Currently we only filter UTXOs for stamps. As we collect, and cache,
      // all stamps, we cache only the ID to lower the amount of storage used
      .then((allStamps: Stamp[]) => allStamps.map(s => ({ tx_hash: s.tx_hash })))
  );
}

type FetchStampCollectionResp = Awaited<ReturnType<typeof fetchStampCollection>>;

export function useStampCollectionQuery<T extends unknown = FetchStampCollectionResp>(
  options?: AppUseQueryConfig<FetchStampCollectionResp, T>
) {
  return useQuery({
    queryKey: [QueryPrefixes.StampCollection],
    queryFn: () => fetchStampCollection(),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 60 * 60 * 5,
    ...options,
  });
}
