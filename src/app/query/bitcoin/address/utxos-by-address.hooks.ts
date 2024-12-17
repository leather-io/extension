import { useNativeSegwitUtxosByAddress } from '@leather.io/query';

import { useInscribedSpendableUtxos } from '@app/features/discarded-inscriptions/use-inscribed-spendable-utxos';
import { useCurrentAccountNativeSegwitIndexZeroSignerNullable } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

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
  const nativeSegwitSigner = useCurrentAccountNativeSegwitIndexZeroSignerNullable();
  const address = nativeSegwitSigner?.address ?? '';
  const spendableUtxos = useInscribedSpendableUtxos();

  const query = useNativeSegwitUtxosByAddress({ address, ...defaultArgs });

  const queryResponseData = query.data ?? [];
  return { ...query, data: [...queryResponseData, ...spendableUtxos] };
}
