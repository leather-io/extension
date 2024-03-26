import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { AppUseQueryConfig } from '@app/query/query-config';
import { QueryPrefixes } from '@app/query/query-prefixes';

export interface Stamp {
  stamp: number;
  block_index: number;
  cpid: string;
  asset_longname: string;
  creator: string;
  divisible: number;
  keyburn: number;
  locked: number;
  message_index: number;
  stamp_base64: string;
  stamp_mimetype: string;
  stamp_url: string;
  supply: number;
  timestamp: string;
  tx_hash: string;
  tx_index: number;
  src_data: string;
  ident: string;
  creator_name: string;
  stamp_gen: string;
  stamp_hash: string;
  is_btc_stamp: number;
  is_reissue: number;
  file_hash: string;
}

export interface Src20Token {
  id: string;
  address: string;
  cpid: string;
  p: string;
  tick: string;
  amt: number;
  block_time: string;
  last_update: number;
}

interface StampsByAddressQueryResponse {
  page: number;
  limit: number;
  totalPages: number;
  total: number;
  last_block: number;
  btc: {
    address: string;
    balance: number;
    txCount: number;
    unconfirmedBalance: number;
    unconfirmedTxCount: number;
  };
  data: {
    stamps: Stamp[];
    src20: Src20Token[];
  };
}

/**
 * @see https://stampchain.io/docs#/default/get_api_v2_balance__address_
 */
async function fetchStampsByAddress(address: string): Promise<StampsByAddressQueryResponse> {
  const resp = await axios.get<StampsByAddressQueryResponse>(
    `https://stampchain.io/api/v2/balance/${address}`
  );
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
