import { HDKey } from '@scure/bip32';
import { useQuery } from '@tanstack/react-query';

import { createGetTaprootUtxosByAddressQueryOptions } from '@leather.io/query';

import { useLeatherNetwork } from '@app/query/leather-query-provider';

import { useBitcoinClient } from '../clients/bitcoin-client';

/**
 * Returns all utxos for the user's current taproot account. The search for
 * utxos iterates through all addresses until a sufficiently large number of
 * empty addresses is found.
 */
export function useGetTaprootUtxosByAddressQuery({
  taprootKeychain,
  currentAccountIndex,
}: {
  taprootKeychain: HDKey | undefined;
  currentAccountIndex: number;
}) {
  const network = useLeatherNetwork();
  const client = useBitcoinClient();

  return useQuery(
    createGetTaprootUtxosByAddressQueryOptions({
      client,
      currentAccountIndex,
      network,
      taprootKeychain,
    })
  );
}
