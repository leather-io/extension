import { useCallback } from 'react';

import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

import { UtxoResponseItem } from '../bitcoin-client';
import { useInscriptionByAddressQuery } from '../ordinals/use-inscriptions.query';
import { useBitcoinPendingTransactionsInputs } from './transactions-by-address.hooks';
import { useGetUtxosByAddressQuery } from './utxos-by-address.query';

/**
 * Warning: ⚠️ These are **all** UTXOs, including Stamped and Inscribed UTXOs.
 * You should probably use `useSpendableCurrentNativeSegwitAccountUtxos` instead.
 */
export function useCurrentNativeSegwitUtxos() {
  const nativeSegwitSigner = useCurrentAccountNativeSegwitIndexZeroSigner();
  return useGetUtxosByAddressQuery(nativeSegwitSigner.address);
}

function useFilterAddressNativeSegwitInscriptions(address: string) {
  const {
    data: inscriptions,
    hasNextPage: hasMoreInscriptionsToLoad,
    isLoading: isLoadingInscriptions,
  } = useInscriptionByAddressQuery(address);

  return useCallback(
    (utxos: UtxoResponseItem[]) => {
      // While infinite query checks if has more data to load, or Stamps
      // are loading, assume nothing is spendable
      if (hasMoreInscriptionsToLoad || isLoadingInscriptions) return [];

      const inscribedUtxos = inscriptions?.pages.flatMap(page => page.results) ?? [];
      return utxos.filter(
        utxo =>
          !inscribedUtxos.some(
            inscription =>
              utxo.txid === inscription.tx_id && utxo.vout === Number(inscription.offset)
          )
      );
    },
    [hasMoreInscriptionsToLoad, inscriptions?.pages, isLoadingInscriptions]
  );
}

function useFilterAddressNativeSegwitPendingTxsUtxos(address: string) {
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

export function useAllSpendableNativeSegwitUtxos(address: string) {
  const filterOutInscriptions = useFilterAddressNativeSegwitInscriptions(address);
  return useGetUtxosByAddressQuery(address, {
    select(utxos) {
      return filterOutInscriptions(utxos);
    },
  });
}

function useSpendableAndNotPendingNativeSegwitUtxos(address: string) {
  const filterOutInscriptions = useFilterAddressNativeSegwitInscriptions(address);
  const filterOutPendingTxsUtxos = useFilterAddressNativeSegwitPendingTxsUtxos(address);

  return useGetUtxosByAddressQuery(address, {
    select(utxos) {
      return filterOutPendingTxsUtxos(filterOutInscriptions(utxos));
    },
  });
}

export function useSpendableCurrentNativeSegwitAccountUtxos() {
  const nativeSegwitSigner = useCurrentAccountNativeSegwitIndexZeroSigner();
  return useSpendableAndNotPendingNativeSegwitUtxos(nativeSegwitSigner.address);
}
