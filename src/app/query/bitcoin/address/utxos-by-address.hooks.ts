import { useNativeSegwitUtxosByAddress } from '@leather.io/query';

import { useInscribedSpendableUtxos } from '@app/features/discarded-inscriptions/use-inscribed-spendable-utxos';
import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

const defaultArgs = {
  filterInscriptionUtxos: true,
  filterPendingTxsUtxos: true,
  filterRunesUtxos: true,
};

/**
 * Warning: ⚠️ To avoid spending inscriptions, when using UTXOs
 * we set `filterInscriptionUtxos` and `filterPendingTxsUtxos` to true
 */
export function useCurrentNativeSegwitUtxos() {
  const { filterInscriptionUtxos, filterPendingTxsUtxos, filterRunesUtxos } = defaultArgs;

  const nativeSegwitSigner = useCurrentAccountNativeSegwitIndexZeroSigner();
  const address = nativeSegwitSigner.address;
  const spendableUtxos = useInscribedSpendableUtxos();

  const query = useNativeSegwitUtxosByAddress({
    address,
    filterInscriptionUtxos,
    filterPendingTxsUtxos,
    filterRunesUtxos,
  });

  return { ...query, data: [...(query.data ?? []), ...spendableUtxos] };
}
