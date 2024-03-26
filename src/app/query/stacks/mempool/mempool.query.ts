import { MempoolTransaction } from '@stacks/stacks-blockchain-api-types';
import { useQuery } from '@tanstack/react-query';

import { safelyFormatHexTxid } from '@app/common/utils/safe-handle-txid';
import { useStacksClient } from '@app/store/common/api-clients.hooks';
import { useSubmittedTransactionsActions } from '@app/store/submitted-transactions/submitted-transactions.hooks';
import { useSubmittedTransactions } from '@app/store/submitted-transactions/submitted-transactions.selectors';

import { useHiroApiRateLimiter } from '../hiro-rate-limiter';

export function useAccountMempoolQuery(address: string) {
  const client = useStacksClient();
  const submittedTransactions = useSubmittedTransactions();
  const submittedTransactionsActions = useSubmittedTransactionsActions();
  const limiter = useHiroApiRateLimiter();

  async function accountMempoolFetcher() {
    return limiter.add(
      () => client.transactionsApi.getAddressMempoolTransactions({ address, limit: 50 }),
      {
        throwOnTimeout: true,
      }
    );
  }

  return useQuery({
    enabled: !!address,
    queryKey: ['account-mempool', address],
    queryFn: accountMempoolFetcher,
    onSuccess: data => {
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
