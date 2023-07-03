import { MempoolTransaction } from '@stacks/stacks-blockchain-api-types';
import { useQuery } from '@tanstack/react-query';

import { queryClient } from '@app/common/persistence';
import { safelyFormatHexTxid } from '@app/common/utils/safe-handle-txid';
import { useStacksClientUnanchored } from '@app/store/common/api-clients.hooks';
import { useSubmittedTransactionsActions } from '@app/store/submitted-transactions/submitted-transactions.hooks';
import { useSubmittedTransactions } from '@app/store/submitted-transactions/submitted-transactions.selectors';

import { useHiroApiRateLimiter } from '../rate-limiter';

export function useAccountMempoolQuery(address: string) {
  const client = useStacksClientUnanchored();
  const submittedTransactions = useSubmittedTransactions();
  const submittedTransactionsActions = useSubmittedTransactionsActions();
  const limiter = useHiroApiRateLimiter();

  async function accountMempoolFetcher() {
    await limiter.removeTokens(1);
    return client.transactionsApi.getAddressMempoolTransactions({ address, limit: 50 });
  }

  return useQuery({
    enabled: !!address,
    queryKey: ['account-mempool', address],
    queryFn: accountMempoolFetcher,
    onSuccess: data => {
      void queryClient.invalidateQueries({ queryKey: ['account-microblock'] });

      const pendingTxids = (data.results as MempoolTransaction[]).map(tx => tx.tx_id);
      submittedTransactions.map(tx => {
        if (pendingTxids.includes(safelyFormatHexTxid(tx.txId)))
          return submittedTransactionsActions.transactionEnteredMempool(tx.txId);
        return;
      });
    },
    refetchOnWindowFocus: false,
  });
}
