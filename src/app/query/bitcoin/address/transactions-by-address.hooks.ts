import { useCallback } from 'react';

import { BitcoinTx } from '@shared/models/transactions/bitcoin-transaction.model';

import { sumNumbers } from '@app/common/math/helpers';

import {
  useGetBitcoinTransactionsByAddressQuery,
  useGetBitcoinTransactionsByAddressesQuery,
} from './transactions-by-address.query';

function useFilterAddressPendingTransactions() {
  return useCallback((txs: BitcoinTx[]) => {
    return txs.filter(tx => !tx.status.confirmed);
  }, []);
}

export function useBitcoinPendingTransactions(addresses: string[]) {
  const filterPendingTransactions = useFilterAddressPendingTransactions();

  return useGetBitcoinTransactionsByAddressesQuery(addresses, {
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

export function calculateOutboundPendingTxsValue(pendingTxs: BitcoinTx[], address: string) {
  // sum all inputs
  const sumInputs = sumNumbers(pendingTxs.flatMap(tx => tx.vin.map(input => input.prevout.value)));

  // get all outputs that are sent back to the address
  const returnedOutputChangeValues = pendingTxs
    .flatMap(tx => tx.vout.map(output => output))
    .filter(v => v.scriptpubkey_address === address)
    .flatMap(output => output.value);

  // sum all filtered outputs
  const sumOutputs = sumNumbers(returnedOutputChangeValues);

  return sumInputs.minus(sumOutputs).toNumber();
}
