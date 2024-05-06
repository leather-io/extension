import { useNativeSegwitUtxosByAddress } from '@leather-wallet/query';

import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

export { filterUtxosWithInscriptions, filterUtxosWithRunes } from '@leather-wallet/query';

const defaultArgs = {
  filterInscriptionUtxos: true,
  filterPendingTxsUtxos: true,
  filterRunesUtxos: true,
};

/**
 * Warning: ⚠️ To avoid spending inscriptions, when using UTXOs
 * we set `filterInscriptionUtxos` and `filterPendingTxsUtxos` to true
 */
export function useCurrentNativeSegwitUtxos(args = defaultArgs) {
  const { filterInscriptionUtxos, filterPendingTxsUtxos, filterRunesUtxos } = args;

  const nativeSegwitSigner = useCurrentAccountNativeSegwitIndexZeroSigner();
  const address = nativeSegwitSigner.address;

  return useNativeSegwitUtxosByAddress({
    address,
    filterInscriptionUtxos,
    filterPendingTxsUtxos,
    filterRunesUtxos,
  });
}
