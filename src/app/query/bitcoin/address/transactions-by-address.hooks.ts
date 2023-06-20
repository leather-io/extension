import { useCallback } from 'react';

import { createMoney } from '@shared/models/money.model';
import { BitcoinTransaction } from '@shared/models/transactions/bitcoin-transaction.model';

import { sumNumbers } from '@app/common/math/helpers';

import { useGetBitcoinTransactionsByAddressQuery } from './transactions-by-address.query';

function useFilterAddressPendingTransactions() {
  return useCallback((txs: BitcoinTransaction[]) => {
    return txs.filter(tx => !tx.status.confirmed);
  }, []);
}

export function useBitcoinPendingTransactions(address: string) {
  const filterPendingTransactions = useFilterAddressPendingTransactions();

  return useGetBitcoinTransactionsByAddressQuery(address, {
    select(txs) {
      return filterPendingTransactions(txs);
    },
  });
}

export function useBitcoinPendingTransactionsInputs(address: string) {
  const filterPendingTransactions = useFilterAddressPendingTransactions();

  return useGetBitcoinTransactionsByAddressQuery(address, {
    select(txs) {
      return filterPendingTransactions(txs).flatMap(tx => tx.vin.map(input => input));
    },
  });
}

function useFilterAddressPendingTxsOutputs(address: string) {
  return useCallback(
    (pendingTxs: BitcoinTransaction[]) => {
      return pendingTxs.flatMap(tx => {
        const inputsFromAddress = tx.vin.filter(
          input => input.prevout.scriptpubkey_address === address
        );
        // Output is possibly change, so we only subtract the value if the address
        // is funding the tx and sending utxos to a different address
        return tx.vout.filter(
          output => inputsFromAddress.length && output.scriptpubkey_address !== address
        );
      });
    },
    [address]
  );
}

export function useBitcoinPendingTransactionsBalance(address: string) {
  const filterPendingTransactions = useFilterAddressPendingTransactions();
  const filterPendingTxsOutputs = useFilterAddressPendingTxsOutputs(address);

  return useGetBitcoinTransactionsByAddressQuery(address, {
    select(txs) {
      return createMoney(
        sumNumbers(filterPendingTxsOutputs(filterPendingTransactions(txs)).map(vout => vout.value)),
        'BTC'
      );
    },
  });
}
