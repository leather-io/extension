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

async function fetchStampsByAddress(address: string): Promise<Stamp[]> {
  return fetch(`https://stampchain.io/api/stamps?wallet_address=${address}`).then(res =>
    res.json()
  );
}

type FetchStampsByAddressResp = Awaited<ReturnType<typeof fetchStampsByAddress>>;

export function useStampsByAddressQuery<T extends unknown = FetchStampsByAddressResp>(
  address: string,
  options?: AppUseQueryConfig<FetchStampsByAddressResp, T>
) {
  return useQuery({
    queryKey: [QueryPrefixes.StampsByAddress],
    queryFn: () => fetchStampsByAddress(address),
    ...options,
  });
}
