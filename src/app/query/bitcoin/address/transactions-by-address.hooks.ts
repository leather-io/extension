import { useMemo } from 'react';

import { createMoney } from '@shared/models/money.model';

import { sumNumbers } from '@app/common/utils';
import { useCurrentBtcNativeSegwitAccountAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

import { useGetBitcoinTransactionsByAddressQuery } from './transactions-by-address.query';

export function useBitcoinPendingTransactions() {
  const bitcoinAddress = useCurrentBtcNativeSegwitAccountAddressIndexZero();
  const { data: bitcoinTransactions } = useGetBitcoinTransactionsByAddressQuery(bitcoinAddress);
  // TODO: use useQuery select method
  return useMemo(
    () => (bitcoinTransactions ?? []).filter(tx => !tx.status.confirmed),
    [bitcoinTransactions]
  );
}

// ts-unused-exports:disable-next-line
export function useBitcoinPendingTransactionsBalance() {
  const bitcoinAddress = useCurrentBtcNativeSegwitAccountAddressIndexZero();
  const pendingTransactions = useBitcoinPendingTransactions();

  return useMemo(
    () =>
      createMoney(
        sumNumbers(
          pendingTransactions
            .flatMap(tx => tx.vout.filter(output => output.scriptpubkey_address === bitcoinAddress))
            .map(vout => vout.value)
        ),
        'BTC'
      ),
    [bitcoinAddress, pendingTransactions]
  );
}
