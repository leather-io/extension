import { useMemo } from 'react';

import {
  MempoolTokenTransferTransaction,
  MempoolTransaction,
} from '@stacks/stacks-blockchain-api-types';
import BigNumber from 'bignumber.js';

import { createMoney } from '@shared/models/money.model';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { increaseValueByOneMicroStx } from '@app/common/math/helpers';
import { microStxToStx } from '@app/common/money/unit-conversion';
import { useTransactionsById } from '@app/query/stacks/transactions/transactions-by-id.query';
import { useCurrentAccountStxAddressState } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { useStacksConfirmedTransactions } from '../transactions/transactions-with-transfers.hooks';
import { useAccountMempoolQuery } from './mempool.query';

const droppedCache = new Map();

function useAccountUnanchoredMempoolTransactions(address: string) {
  const analytics = useAnalytics();
  const query = useAccountMempoolQuery(address);
  const accountMempoolTxs = query.data;
  const mempoolTxs = (accountMempoolTxs ? accountMempoolTxs.results : []) as MempoolTransaction[];
  const results = mempoolTxs.filter(
    tx => tx.tx_status === 'pending' && !droppedCache.has(tx.tx_id)
  );
  const txs = useTransactionsById(results.map(tx => tx.tx_id));
  return useMemo(() => {
    return {
      query,
      transactions: txs
        .map(tx => tx.data)
        .filter(tx => {
          if (typeof tx === 'undefined') return false;
          if (droppedCache.has(tx.tx_id)) return false;
          if (tx.tx_status !== 'pending') {
            // Stale txs persist in the mempool endpoint so we
            // need to cache dropped txids to prevent unneeded fetches
            void analytics.track('transaction_added_to_dropped_cache');
            droppedCache.set(tx.tx_id, true);
            return false;
          }
          return true;
        }),
    };
  }, [txs, query, analytics]);
}

export function useStacksPendingTransactions() {
  const address = useCurrentAccountStxAddressState();
  const { query, transactions } = useAccountUnanchoredMempoolTransactions(address ?? '');
  return useMemo(() => {
    const nonEmptyTransactions = transactions.filter(tx => !!tx) as MempoolTransaction[];
    return { query, transactions: nonEmptyTransactions };
  }, [query, transactions]);
}

export function useCurrentAccountMempool() {
  const address = useCurrentAccountStxAddressState();
  return useAccountMempoolQuery(address ?? '');
}

export function useCurrentAccountMempoolTransactionsBalance() {
  const address = useCurrentAccountStxAddressState();
  const { transactions: pendingTransactions } = useStacksPendingTransactions();
  const confirmedTxs = useStacksConfirmedTransactions();

  const pendingOutboundTxs = pendingTransactions.filter(tx => {
    if (confirmedTxs.some(confirmedTx => confirmedTx.nonce === tx.nonce)) {
      return false;
    }
    return tx.tx_type === 'token_transfer' && tx.sender_address === address;
  }) as unknown as MempoolTokenTransferTransaction[];

  const tokenTransferTxsBalance = pendingOutboundTxs.reduce(
    (acc, tx) => acc.plus(tx.token_transfer.amount),
    new BigNumber(0)
  );
  const pendingTxsFeesBalance = pendingOutboundTxs.reduce(
    (acc, tx) => acc.plus(tx.fee_rate),
    new BigNumber(0)
  );

  return createMoney(tokenTransferTxsBalance.plus(pendingTxsFeesBalance), 'STX');
}

export function useStacksValidateFeeByNonce() {
  const { transactions } = useStacksPendingTransactions();

  function changeFeeByNonce({ nonce, fee }: { nonce: number; fee: number }) {
    return transactions.reduce((updatedFee, tx) => {
      if (Number(tx.nonce) === nonce && microStxToStx(tx.fee_rate).toNumber() >= fee) {
        return increaseValueByOneMicroStx(microStxToStx(tx.fee_rate));
      }
      return updatedFee;
    }, fee);
  }
  return { changeFeeByNonce };
}
