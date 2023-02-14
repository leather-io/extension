import { useMemo } from 'react';

import { createMoney } from '@shared/models/money.model';

import { sumNumbers } from '@app/common/utils';
import { useCurrentBtcAccountAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/bitcoin-account.hooks';

import { useGetBitcoinTransactionsByAddressQuery } from './transactions-by-address.query';

export function useBitcoinPendingTransactions() {
  const bitcoinAddress = useCurrentBtcAccountAddressIndexZero();
  const { data: bitcoinTransactions } = useGetBitcoinTransactionsByAddressQuery(bitcoinAddress);
  // TODO: use useQuery select method
  return useMemo(
    () => (bitcoinTransactions ?? []).filter(tx => !tx.status.confirmed),
    [bitcoinTransactions]
  );
}

export function useBitcoinPendingTransactionsBalance() {
  const bitcoinAddress = useCurrentBtcAccountAddressIndexZero();
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
