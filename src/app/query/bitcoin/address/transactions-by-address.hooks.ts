import { useMemo } from 'react';

import { createMoney } from '@shared/models/money.model';

import { sumNumbers } from '@app/common/math/helpers';

import { useGetBitcoinTransactionsByAddressQuery } from './transactions-by-address.query';

export function useBitcoinPendingTransactions(address: string) {
  const { data: bitcoinTransactions } = useGetBitcoinTransactionsByAddressQuery(address);
  // TODO: use useQuery select method
  return useMemo(
    () => (bitcoinTransactions ?? []).filter(tx => !tx.status.confirmed),
    [bitcoinTransactions]
  );
}

export function useBitcoinPendingTransactionsBalance(address: string) {
  const pendingTransactions = useBitcoinPendingTransactions(address);

  return useMemo(
    () =>
      createMoney(
        sumNumbers(
          pendingTransactions
            .flatMap(tx => tx.vout.filter(output => output.scriptpubkey_address === address))
            .filter(tx => tx.scriptpubkey_address !== address)
            .map(vout => vout.value)
        ),
        'BTC'
      ),
    [address, pendingTransactions]
  );
}
