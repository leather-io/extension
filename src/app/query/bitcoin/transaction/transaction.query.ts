import { useQuery } from '@tanstack/react-query';

import { useBitcoinClient } from '@app/store/common/api-clients.hooks';

export function usePostRawBitcoinTransactionQuery(rawTx: string) {
  const client = useBitcoinClient();
  return useQuery({
    enabled: rawTx !== '',
    queryKey: ['raw-bitcoin-tx', rawTx],
    queryFn: () => client.transactionsApi.postRawTransaction(rawTx),
  });
}
