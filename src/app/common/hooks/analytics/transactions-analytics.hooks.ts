import { statusFromTx } from '@app/common/api/transactions';
import { isAddressTransactionWithTransfers } from '@app/common/transactions/transaction-utils';
import { useCurrentAccount } from '@app/store/accounts/account.hooks';
import {
  AddressTransactionWithTransfers,
  MempoolTransaction,
} from '@stacks/stacks-blockchain-api-types';
import dayjs from 'dayjs';
import { useAnalytics } from './use-analytics';
import { StacksTransaction } from '@stacks/transactions';
import { AccountStxBalanceBigNumber } from '@shared/models/account-types';
import { useCurrentAccountUnanchoredBalances } from '@app/query/balance/balance.hooks';
import { useAnalyticsHasStxDeposits } from '@app/store/analytics/analytics.selectors';
import { store } from '@app/store';
import { analyticsActions } from '@app/store/analytics/analytics.actions';
import { useEffect, useMemo } from 'react';
import { useCurrentNetworkState } from '@app/store/network/networks.hooks';
import { safelyFormatHexTxid } from '@app/common/utils/safe-handle-txid';

let previousAccountTransactions: Map<string, TxStatus>;

function changedTransactions(previousTxs: Map<string, TxStatus>, txs: Map<string, TxStatus>) {
  if (!previousTxs) return;
  const result = new Map(
    [...txs]
      .filter(
        ([key, value]) =>
          (!previousTxs.get(key) && value.status === 'submitted') ||
          (previousTxs.get(key) && previousTxs.get(key)?.status !== value.status)
      )
      .map(([key, value]) => {
        const timeSinceLastState =
          previousTxs.get(key) && dayjs(value.timeIso).diff(previousTxs.get(key)?.timeIso);
        return [
          key,
          { ...value, previous_state: previousTxs.get(key)?.status, timeSinceLastState },
        ];
      })
  );
  return result;
}

interface TxStatus {
  timeIso: string;
  broadcastTimeIso: string;
  status: string;
  type: 'inbound' | 'outbound';
  timeSinceBroadcast: number;
  tx: AddressTransactionWithTransfers | MempoolTransaction | StacksTransaction;
}

export function useTrackChangedTransactions(
  transactions: (AddressTransactionWithTransfers | MempoolTransaction)[],
  submittedTxs: StacksTransaction[]
) {
  const currentAccount = useCurrentAccount();
  const analytics = useAnalytics();
  const now = new Date().toISOString();

  const result = new Map(previousAccountTransactions);
  submittedTxs.forEach(tx => {
    const status = 'submitted';
    result.set(safelyFormatHexTxid(tx.txid()), {
      broadcastTimeIso: now,
      status,
      timeIso: now,
      timeSinceBroadcast: 0,
      type: 'outbound',
      tx,
    });
  });

  transactions.forEach(atx => {
    let time, tx;
    let type: 'inbound' | 'outbound';
    if (isAddressTransactionWithTransfers(atx)) {
      tx = atx.tx;
      type = tx.sender_address === currentAccount?.address ? 'outbound' : 'inbound';
      time = ('burn_block_time_iso' in tx && tx.burn_block_time_iso) || now;
    } else {
      tx = atx;
      type = 'outbound';
      time = ('receipt_time_iso' in tx && tx.receipt_time_iso) || now;
    }

    const status = statusFromTx(tx);
    if (status === 'success_microblock') {
      time = now; // since there is no real timestamp for microblocks, we just use the current time
    }
    const broadcastTimeIso = `${
      previousAccountTransactions?.get(tx.tx_id)?.broadcastTimeIso || now
    }`;
    const timeSinceBroadcast = dayjs(time).diff(broadcastTimeIso);
    result.set(tx.tx_id, {
      type,
      timeIso: time.toString(),
      status,
      tx: atx,
      broadcastTimeIso,
      timeSinceBroadcast,
    });
  });

  const changed = changedTransactions(previousAccountTransactions, result);

  previousAccountTransactions = result;
  if (!changed) return result;

  [...changed].forEach(([_, value]) =>
    analytics.track('change_transaction_state', { ...value, tx: undefined })
  );
  return result;
}

function useIsFirstDeposit(stxBalance: AccountStxBalanceBigNumber | undefined): boolean {
  const currentNetwork = useCurrentNetworkState();
  const hasStxDeposits = useAnalyticsHasStxDeposits()[currentNetwork.chainId];
  const hasZeroStx = useMemo(
    () => stxBalance?.total_received.isEqualTo(0) || false,
    [stxBalance?.total_received]
  );
  useEffect(() => {
    if (!stxBalance) return;
    if (hasZeroStx || !hasStxDeposits) {
      store.dispatch(
        analyticsActions.hasStxDeposits({
          network: currentNetwork.chainId,
          hasStxDeposits: !hasZeroStx,
        })
      );
    }
  }, [hasZeroStx, hasStxDeposits, currentNetwork.chainId, stxBalance]);
  return !hasStxDeposits && !hasZeroStx;
}

export function useTrackFirstDeposit() {
  const analytics = useAnalytics();
  const { data: balances } = useCurrentAccountUnanchoredBalances();
  const firstDeposit = useIsFirstDeposit(balances?.stx);
  useEffect(() => {
    if (!firstDeposit || !balances) return;
    void analytics.track('deposit_first_stx', { type: 'stx' });
  }, [analytics, balances, firstDeposit]);
}
