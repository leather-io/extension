import { useCurrentAccountNativeSegwitAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

import { useInscriptionByAddressQuery } from '../ordinals/use-inscriptions.query';
import { useStampsByAddressQuery } from '../stamps/stamps-by-address.query';
import { useGetUtxosByAddressQuery } from './utxos-by-address.query';

export function useSpendableNativeSegwitUtxos(address: string) {
  const {
    data: inscriptions,
    hasNextPage: hasMoreInscriptionsToLoad,
    isLoading: isLoadingInscriptions,
  } = useInscriptionByAddressQuery(address);

  const { data: stamps = [], isLoading: isLoadingStamps } = useStampsByAddressQuery(address);

  return useGetUtxosByAddressQuery(address, {
    select(utxos) {
      // While infinite query check has more data to load, or Stamps are loading
      // assume nothing is spendable
      if (hasMoreInscriptionsToLoad || isLoadingInscriptions || isLoadingStamps) return [];

      const inscribedUtxos = inscriptions?.pages.flatMap(page => page.results) ?? [];

      return utxos
        .filter(
          utxo =>
            !inscribedUtxos.some(
              inscription =>
                utxo.txid === inscription.tx_id && utxo.vout === Number(inscription.offset)
            )
        )
        .filter(utxo => !stamps.some(stamp => utxo.txid === stamp.tx_hash));
    },
  });
}

export function useSpendableCurrentNativeSegwitAccountUtxos() {
  const currentAccountBtcAddress = useCurrentAccountNativeSegwitAddressIndexZero();
  return useSpendableNativeSegwitUtxos(currentAccountBtcAddress);
}
