import { useCallback } from 'react';

import { InscriptionResponseItem } from '@shared/models/inscription.model';

import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

import { UtxoResponseItem, UtxoWithDerivationPath } from '../bitcoin-client';
import { useInscriptionsByAddressQuery } from '../ordinals/inscriptions.query';
import { useBitcoinPendingTransactionsInputs } from './transactions-by-address.hooks';
import { useGetUtxosByAddressQuery } from './utxos-by-address.query';

export function filterUtxosWithInscriptions(
  inscriptions: InscriptionResponseItem[],
  utxos: UtxoWithDerivationPath[] | UtxoResponseItem[]
) {
  return utxos.filter(
    utxo =>
      !inscriptions?.some(
        inscription => `${utxo.txid}:${utxo.vout.toString()}` === inscription.output
      )
  );
}

/**
 * Warning: ⚠️ These are **all** UTXOs, including Stamped and Inscribed UTXOs.
 * You should probably use `useCurrentNativeSegwitAccountSpendableUtxos` instead.
 */
export function useCurrentNativeSegwitUtxos() {
  const nativeSegwitSigner = useCurrentAccountNativeSegwitIndexZeroSigner();
  return useGetUtxosByAddressQuery(nativeSegwitSigner.address);
}

function useFilterInscriptionsByAddress(address: string) {
  const {
    data: inscriptionsList,
    hasNextPage: hasMoreInscriptionsToLoad,
    isLoading: isLoadingInscriptions,
  } = useInscriptionsByAddressQuery(address);

  return useCallback(
    (utxos: UtxoResponseItem[]) => {
      // While infinite query checks if has more data to load, or Stamps
      // are loading, assume nothing is spendable
      if (hasMoreInscriptionsToLoad || isLoadingInscriptions) return [];

      const inscriptions = inscriptionsList?.pages.flatMap(page => page.results) ?? [];

      return filterUtxosWithInscriptions(inscriptions, utxos);
    },
    [hasMoreInscriptionsToLoad, inscriptionsList?.pages, isLoadingInscriptions]
  );
}

function useFilterPendingUtxosByAddress(address: string) {
  const { data: pendingInputs = [] } = useBitcoinPendingTransactionsInputs(address);

  return useCallback(
    (utxos: UtxoResponseItem[]) => {
      return utxos.filter(
        utxo =>
          !pendingInputs.find(
            input => input.prevout.scriptpubkey_address === address && input.txid === utxo.txid
          )
      );
    },
    [address, pendingInputs]
  );
}

export function useAllSpendableUtxosByAddress(address: string) {
  const filterOutInscriptions = useFilterInscriptionsByAddress(address);
  return useGetUtxosByAddressQuery(address, {
    select(utxos) {
      return filterOutInscriptions(utxos);
    },
  });
}

function useSpendableAndNotPendingUtxosByAddress(address: string) {
  const filterOutInscriptions = useFilterInscriptionsByAddress(address);
  const filterOutPendingTxsUtxos = useFilterPendingUtxosByAddress(address);

  return useGetUtxosByAddressQuery(address, {
    select(utxos) {
      return filterOutPendingTxsUtxos(filterOutInscriptions(utxos));
    },
  });
}

export function useCurrentNativeSegwitAccountSpendableUtxos() {
  const nativeSegwitSigner = useCurrentAccountNativeSegwitIndexZeroSigner();
  return useSpendableAndNotPendingUtxosByAddress(nativeSegwitSigner.address);
}
