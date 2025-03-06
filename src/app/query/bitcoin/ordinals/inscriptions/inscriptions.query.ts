import { useCallback, useMemo } from 'react';

import { useQueries, useQuery } from '@tanstack/react-query';

import {
  type UtxoResponseItem,
  combineInscriptionResults,
  createBestInSlotInscription,
  createInscriptionByXpubQuery,
  createNumberOfInscriptionsFn,
  filterUninscribedUtxosToRecoverFromTaproot,
  filterUtxosWithInscriptions,
  useBitcoinClient,
  useGetTaprootUtxosByAddressQuery,
  utxosToBalance,
} from '@leather.io/query';
import { isString } from '@leather.io/utils';

import { useCurrentAccountIndex } from '@app/store/accounts/account';
import {
  useCurrentBitcoinAccountNativeSegwitXpub,
  useCurrentBitcoinAccountXpubs,
} from '@app/store/accounts/blockchain/bitcoin/bitcoin.hooks';
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

export function useCurrentNativeSegwitInscriptions() {
  const client = useBitcoinClient();
  const nativeSegwitXpub = useCurrentBitcoinAccountNativeSegwitXpub();
  return useQuery({
    ...createInscriptionByXpubQuery(client, nativeSegwitXpub ?? ''),
    enabled: isString(nativeSegwitXpub),
    select(data) {
      return data.data.map(createBestInSlotInscription);
    },
  });
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

export function useFilterNativeSegwitInscriptions() {
  const { data: inscriptions } = useCurrentNativeSegwitInscriptions();

  const filterOutInscriptions = useCallback(
    (utxos: UtxoResponseItem[]) => utxos.filter(filterUtxosWithInscriptions(inscriptions ?? [])),
    [inscriptions]
  );

  return { filterOutInscriptions };
}
