import { useQuery } from '@tanstack/react-query';

import { BitcoinFeeEstimates } from '@shared/models/fees/bitcoin-fees.model';

import { AppUseQueryConfig } from '@app/query/query-config';
import { useBitcoinClient } from '@app/store/common/api-clients.hooks';

import { BitcoinClient } from '../bitcoin-client';

function fetchBitcoinFeeEstimates(client: BitcoinClient) {
  return async () => {
    const resp = (await client.feeEstimatesApi.getFeeEstimates()) as BitcoinFeeEstimates;
    return resp;
  };
}

type FetchBitcoinFeeEstimatesResp = Awaited<
  ReturnType<ReturnType<typeof fetchBitcoinFeeEstimates>>
>;

// https://github.com/bitcoinbook/bitcoinbook/blob/develop/ch06.asciidoc#transaction-fees
// Possible alt api if needed: https://bitcoinfees.earn.com/api
export function useGetBitcoinFeeEstimatesQuery<T extends unknown = FetchBitcoinFeeEstimatesResp>(
  options?: AppUseQueryConfig<FetchBitcoinFeeEstimatesResp, T>
) {
  const client = useBitcoinClient();

  return useQuery({
    queryKey: ['bitcoin-fee-estimates'],
    queryFn: fetchBitcoinFeeEstimates(client),
    ...options,
  });
}
