import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

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
  const resp = await axios.get(`https://stampchain.io/api/stamps?wallet_address=${address}`);
  return resp.data;
}

type FetchStampsByAddressResp = Awaited<ReturnType<typeof fetchStampsByAddress>>;

export function useStampsByAddressQuery<T extends unknown = FetchStampsByAddressResp>(
  address: string,
  options?: AppUseQueryConfig<FetchStampsByAddressResp, T>
) {
  return useQuery({
    queryKey: [QueryPrefixes.StampsByAddress, address],
    queryFn: () => fetchStampsByAddress(address),
    ...options,
    refetchOnWindowFocus: false,
  });
}
