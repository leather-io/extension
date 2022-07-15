import { useQuery } from 'react-query';

import { useApi } from '@app/store/common/api-clients.hooks';

export function useAccountMempool(address: string) {
  const api = useApi();

  function accountMempoolFetcher() {
    return api.transactionsApi.getAddressMempoolTransactions({ address, limit: 50 });
  }

  return useQuery({
    queryKey: ['account-mempool', address],
    queryFn: accountMempoolFetcher,
  });
}
