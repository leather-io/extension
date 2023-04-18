import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { BitcoinTransaction } from '@shared/models/transactions/bitcoin-transaction.model';

import { useBitcoinClient } from '@app/store/common/api-clients.hooks';

const staleTime = 5 * 1000;

export function useGetBitcoinTransactionsByAddressQuery(
  address: string
): UseQueryResult<BitcoinTransaction[]> {
  const client = useBitcoinClient();

  return useQuery({
    enabled: !!address,
    queryKey: ['btc-txs-by-address', address],
    queryFn: () => client.addressApi.getTransactionsByAddress(address),
    refetchInterval: staleTime,
    staleTime,
  });
}
