import { useMemo } from 'react';

import { createMoney } from '@shared/models/money.model';

import { sumNumbers } from '@app/common/math/helpers';

import { useGetBitcoinTransactionsByAddressQuery } from './transactions-by-address.query';

export function useBitcoinPendingTransactions(address: string) {
  return useGetBitcoinTransactionsByAddressQuery(address, {
    select(txs) {
      return txs.filter(tx => !tx.status.confirmed);
    },
  });
}

export function useBitcoinPendingTransactionsBalance(address: string) {
  const { data: pendingTransactions = [] } = useBitcoinPendingTransactions(address);

  return useMemo(
    () =>
      createMoney(
        sumNumbers(
          pendingTransactions
            .flatMap(tx => tx.vout.filter(output => output.scriptpubkey_address !== address))
            .map(vout => vout.value)
        ),
        'BTC'
      ),
    [address, pendingTransactions]
  );
}

export function useBitcoinPendingTransactionsInputs(address: string) {
  const { data: pendingTransactions = [] } = useBitcoinPendingTransactions(address);

  return useMemo(() => {
    return pendingTransactions.flatMap(tx => tx.vin.map(input => input));
  }, [pendingTransactions]);
}
