import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

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

export function useSpendableNativeSegwitUtxos(address: string) {
  const {
    data: inscriptions,
    hasNextPage: hasMoreInscriptionsToLoad,
    isLoading: isLoadingInscriptions,
  } = useInscriptionByAddressQuery(address);
  const pendingInputs = useBitcoinPendingTransactionsInputs(address);

  return useGetUtxosByAddressQuery(address, {
    select(utxos) {
      // While infinite query check has more data to load, or Stamps are loading
      // assume nothing is spendable
      if (hasMoreInscriptionsToLoad || isLoadingInscriptions) return [];

      const inscribedUtxos = inscriptions?.pages.flatMap(page => page.results) ?? [];

      return (
        utxos
          .filter(
            utxo =>
              !inscribedUtxos.some(
                inscription =>
                  utxo.txid === inscription.tx_id && utxo.vout === Number(inscription.offset)
              )
          )
          // Safety check to make sure we don't reuse utxos in a pending tx
          .filter(utxo => !pendingInputs.find(input => input.txid === utxo.txid))
      );
    },
  });
}

export function useSpendableCurrentNativeSegwitAccountUtxos() {
  const nativeSegwitSigner = useCurrentAccountNativeSegwitIndexZeroSigner();
  return useSpendableNativeSegwitUtxos(nativeSegwitSigner.address);
}
