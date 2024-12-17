import { useNativeSegwitUtxosByAddress } from '@leather.io/query';

import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useHasUserBypassedInscriptionChecks } from '@app/store/settings/settings.selectors';

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

  const hasUserByPassedInscriptionChecks = useHasUserBypassedInscriptionChecks();

  const nativeSegwitSigner = useCurrentAccountNativeSegwitIndexZeroSigner();
  const address = nativeSegwitSigner.address;

  return useNativeSegwitUtxosByAddress({
    address,
    filterInscriptionUtxos: hasUserByPassedInscriptionChecks ? false : filterInscriptionUtxos,
    filterPendingTxsUtxos,
    filterRunesUtxos,
  });
}
