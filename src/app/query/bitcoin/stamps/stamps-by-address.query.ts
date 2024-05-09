import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ZodError, z } from 'zod';

import { analytics } from '@shared/utils/analytics';

import { AppUseQueryConfig } from '@app/query/query-config';
import { QueryPrefixes } from '@app/query/query-prefixes';

const stampSchema = z.object({
  stamp: z.number(),
  block_index: z.number().optional(),
  cpid: z.string().optional(),
  asset_longname: z.string().optional(),
  creator: z.string(),
  divisible: z.number(),
  keyburn: z.number().optional(),
  locked: z.number(),
  message_index: z.number().optional(),
  stamp_base64: z.string(),
  stamp_mimetype: z.string(),
  stamp_url: z.string(),
  supply: z.number(),
  timestamp: z.string().optional(),
  tx_hash: z.string(),
  tx_index: z.number().optional(),
  src_data: z.string().optional(),
  ident: z.string().optional(),
  creator_name: z.string().optional().nullable(),
  stamp_gen: z.string().optional(),
  stamp_hash: z.string().optional(),
  is_btc_stamp: z.number().optional(),
  is_reissue: z.number().optional(),
  file_hash: z.string().optional(),
});

export type Stamp = z.infer<typeof stampSchema>;

const src20TokenSchema = z.object({
  id: z.string().optional(),
  address: z.string(),
  cpid: z.string().optional(),
  p: z.string(),
  tick: z.string(),
  amt: z.string().optional(),
  block_time: z.string(),
  last_update: z.number(),
});

export type Src20Token = z.infer<typeof src20TokenSchema>;

const stampsByAdressSchema = z.object({
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
  total: z.number(),
  last_block: z.number().optional(),
  btc: z.object({
    address: z.string(),
    balance: z.number(),
    txCount: z.number(),
    unconfirmedBalance: z.number(),
    unconfirmedTxCount: z.number(),
  }),
  data: z.object({
    stamps: z.array(stampSchema),
    src20: z.array(src20TokenSchema),
  }),
});

type StampsByAddressQueryResponse = z.infer<typeof stampsByAdressSchema>;

/**
 * @see https://stampchain.io/docs#/default/get_api_v2_balance__address_
 */
async function fetchStampsByAddress(address: string): Promise<StampsByAddressQueryResponse> {
  const resp = await axios.get<StampsByAddressQueryResponse>(
    `https://stampchain.io/api/v2/balance/${address}`
  );
  try {
    return stampsByAdressSchema.parse(resp.data);
  } catch (e) {
    if (e instanceof ZodError) void analytics.track('schema_fail', e);
    throw e;
  }
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
