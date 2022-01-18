import { useQuery } from 'react-query';

import { useSetMempoolTransactions } from '@store/accounts/account.hooks';
import { useApi } from '@store/common/api-clients.hooks';
import type { MempoolTransaction } from '@stacks/stacks-blockchain-api-types';

export function useAccountMempool(address: string) {
  const api = useApi();
  const setMempoolTxs = useSetMempoolTransactions();

  function accountMempoolFetcher() {
    return api.transactionsApi.getAddressMempoolTransactions({ address, limit: 50 });
  }

  return useQuery({
    queryKey: ['account-mempool', address],
    queryFn: accountMempoolFetcher,
    onSuccess(resp) {
      setMempoolTxs(resp.results as MempoolTransaction[]);
    },
  });
}
