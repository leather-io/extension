import { useQueries } from '@tanstack/react-query';

import { createGetBitcoinTransactionsByAddressQueryOptions } from '@leather.io/query';

import { useBitcoinClient } from '../clients/bitcoin-client';

export function useGetBitcoinTransactionsByAddressListQuery(addresses: string[]) {
  const client = useBitcoinClient();

  return useQueries({
    queries: addresses.map(address => {
      return createGetBitcoinTransactionsByAddressQueryOptions({ address, client });
    }),
  });
}
