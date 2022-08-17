import BigNumber from 'bignumber.js';
import {
  MempoolTokenTransferTransaction,
  MempoolTransaction,
} from '@stacks/stacks-blockchain-api-types';

import { useTransactionsById } from '@app/query/stacks/transactions/transactions-by-id.query';
import { useCurrentAccountStxAddressState } from '@app/store/accounts/account.hooks';

import { useAccountMempool } from './mempool.query';

const droppedCache = new Map();

function useAccountUnanchoredMempoolTransactions(address: string) {
  const { data: accountMempoolTxs } = useAccountMempool(address);
  const mempoolTxs = (accountMempoolTxs ? accountMempoolTxs.results : []) as MempoolTransaction[];
  const results = mempoolTxs.filter(
    tx => tx.tx_status === 'pending' && !droppedCache.has(tx.tx_id)
  );
  const txs = useTransactionsById(results.map(tx => tx.tx_id));
  return txs
    .map(tx => tx.data)
    .filter(tx => {
      if (typeof tx === 'undefined') return false;
      if (droppedCache.has(tx.tx_id)) return false;
      if (tx.tx_status !== 'pending') {
        // because stale txs persist in the mempool endpoint
        // we should cache dropped txids to prevent unneeded fetches
        droppedCache.set(tx.tx_id, true);
        return false;
      }
      return true;
    });
}

export function useCurrentAccountFilteredMempoolTransactionsState() {
  const address = useCurrentAccountStxAddressState();
  return useAccountUnanchoredMempoolTransactions(address ?? '').filter(
    tx => !!tx
  ) as MempoolTransaction[];
}

export function useCurrentAccountMempool() {
  const address = useCurrentAccountStxAddressState();
  return useAccountMempool(address ?? '');
}

export function useCurrentAccountMempoolTransactionsBalance() {
  const pendingTransactions = useCurrentAccountFilteredMempoolTransactionsState();
  const tokenTransferTxsBalance = (
    pendingTransactions.filter(
      tx => tx.tx_type === 'token_transfer'
    ) as unknown as MempoolTokenTransferTransaction[]
  ).reduce((acc, tx) => acc.plus(tx.token_transfer.amount), new BigNumber(0));
  const pendingTxsFeesBalance = pendingTransactions.reduce(
    (acc, tx) => acc.plus(tx.fee_rate),
    new BigNumber(0)
  );
  return tokenTransferTxsBalance.plus(pendingTxsFeesBalance);
}
