import { useCallback, useMemo } from 'react';

import { useQueries } from '@tanstack/react-query';

import {
  combineInscriptionResults,
  createInscriptionByXpubQuery,
  createNumberOfInscriptionsFn,
  filterUninscribedUtxosToRecoverFromTaproot,
  useBitcoinClient,
  useGetTaprootUtxosByAddressQuery,
  utxosToBalance,
} from '@leather.io/query';

import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { useCurrentBitcoinAccountXpubs } from '@app/store/accounts/blockchain/bitcoin/bitcoin.hooks';
import { useCurrentTaprootAccount } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';

interface UseInscriptionArgs {
  xpubs: string[];
}
export function useInscriptions({ xpubs }: UseInscriptionArgs) {
  const client = useBitcoinClient();
  const queries = xpubs.map(xpub => createInscriptionByXpubQuery(client, xpub));
  return useQueries({ queries, combine: combineInscriptionResults });
}

export function useNumberOfInscriptionsOnUtxo() {
  const xpubs = useCurrentBitcoinAccountXpubs();
  const inscriptionQueries = useInscriptions({ xpubs });

  // Unsafe as implementation doesn't wait for all results to be successful,
  // assumes they are
  return useCallback(
    (txid: string, vout: number) => createNumberOfInscriptionsFn(inscriptionQueries)(txid, vout),
    [inscriptionQueries]
  );
}

export function useCurrentTaprootAccountUninscribedUtxos() {
  const taprootAccount = useCurrentTaprootAccount();
  const currentAccountIndex = useCurrentAccountIndex();
  const { data: utxos = [] } = useGetTaprootUtxosByAddressQuery({
    taprootKeychain: taprootAccount?.keychain,
    currentAccountIndex,
  });
  const query = useInscriptions({ xpubs: [`tr(${taprootAccount?.keychain.publicExtendedKey!})`] });
  return useMemo(
    () => filterUninscribedUtxosToRecoverFromTaproot(utxos, query.inscriptions ?? []),
    [query.inscriptions, utxos]
  );
}

export function useCurrentTaprootAccountBalance() {
  const uninscribedUtxos = useCurrentTaprootAccountUninscribedUtxos();
  return useMemo(() => utxosToBalance(uninscribedUtxos), [uninscribedUtxos]);
}
