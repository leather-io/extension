import { useMemo } from 'react';

import { useNativeSegwitUtxosByAddress } from '@leather.io/query';

import { useCurrentNativeSegwitInscriptions } from '@app/query/bitcoin/ordinals/inscriptions/inscriptions.query';
import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useDiscardedInscriptions } from '@app/store/settings/settings.selectors';

export function useInscribedSpendableUtxos() {
  const { hasInscriptionBeenDiscarded } = useDiscardedInscriptions();

  const { data: nativeSegwitInscriptions } = useCurrentNativeSegwitInscriptions();

  const nativeSegwitSigner = useCurrentAccountNativeSegwitIndexZeroSigner();
  const address = nativeSegwitSigner.address;

  // Utxos but don't filter the inscribed ones
  const { data: nativeSegwitUtxos } = useNativeSegwitUtxosByAddress({
    address,
    filterInscriptionUtxos: false,
    filterPendingTxsUtxos: true,
    filterRunesUtxos: true,
  });

  return useMemo(() => {
    if (!nativeSegwitUtxos || !nativeSegwitInscriptions) return [];

    // Preformatting utxos so that inscriptions are delcared as an object
    // property helps the following filter logic
    const utxosFormatted = nativeSegwitUtxos.map(utxo => {
      return {
        ...utxo,
        inscriptions: nativeSegwitInscriptions.filter(
          inscription => inscription.txid === utxo.txid && Number(inscription.output) === utxo.vout
        ),
      };
    });

    const utxosThatCanBeSpentBecauseAllUtxosInsideWereDiscarded = utxosFormatted
      // If there are no inscriptions they're not being filtered and we don't care about them
      .filter(utxo => utxo.inscriptions.length > 0)
      // For a given utxo with inscriptions, check that all inscriptions in it
      // have been discarded. This check ensures we don't spend a utxo if only
      // one of potentially many have been discarded
      .filter(utxo =>
        utxo.inscriptions.every(inscription => hasInscriptionBeenDiscarded(inscription))
      );

    return utxosThatCanBeSpentBecauseAllUtxosInsideWereDiscarded;
  }, [nativeSegwitUtxos, nativeSegwitInscriptions, hasInscriptionBeenDiscarded]);
}
