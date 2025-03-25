import { useCallback } from 'react';

import { useQueries, useQuery } from '@tanstack/react-query';

import { BitcoinTx } from '@leather.io/models';
import { createGetBitcoinTransactionsByAddressQueryOptions } from '@leather.io/query';

import { useBitcoinClient } from '../clients/bitcoin-client';

function useFilterAddressPendingTransactions() {
  return useCallback((txs: BitcoinTx[]) => txs.filter(tx => !tx.status.confirmed), []);
}

export function useBitcoinPendingTransactions(addresses: string[]) {
  const filterPendingTransactions = useFilterAddressPendingTransactions();
  const client = useBitcoinClient();

  return useQueries({
    queries: addresses.map(address => ({
      ...createGetBitcoinTransactionsByAddressQueryOptions({ address, client }),
      select: (resp: BitcoinTx[]) => filterPendingTransactions(resp),
    })),
  });
}

export function useBitcoinPendingTransactionsInputs(address: string) {
  const filterPendingTransactions = useFilterAddressPendingTransactions();
  const client = useBitcoinClient();

  return useQuery({
    ...createGetBitcoinTransactionsByAddressQueryOptions({ address, client }),
    select: (resp: BitcoinTx[]) =>
      filterPendingTransactions(resp).flatMap(tx => tx.vin.map(input => input)),
  });
}
