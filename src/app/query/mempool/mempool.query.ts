import { useQuery } from 'react-query';
import { MempoolTransaction } from '@stacks/stacks-blockchain-api-types';

import { useApi } from '@app/store/common/api-clients.hooks';
import { safelyFormatHexTxid } from '@app/common/utils/safe-handle-txid';
import { useSubmittedTransactionsActions } from '@app/store/submitted-transactions/submitted-transactions.hooks';
import { useSubmittedTransactions } from '@app/store/submitted-transactions/submitted-transactions.selectors';

export function useAccountMempool(address: string) {
  const api = useApi();
  const submittedTransactions = useSubmittedTransactions();
  const submittedTransactionsActions = useSubmittedTransactionsActions();

  function accountMempoolFetcher() {
    return api.transactionsApi.getAddressMempoolTransactions({ address, limit: 50 });
  }

  return useQuery({
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
  });
}
