import { BitcoinNativeSegwitAccountLoader } from '@app/components/loaders/bitcoin-account-loader';
import { BitcoinUtxosLoader } from '@app/components/loaders/bitcoin-utxos-loader';

import { BitcoinSwapProvider } from '../providers/bitcoin-swap-provider';

export function BitcoinSwapContainer() {
  return (
    <BitcoinNativeSegwitAccountLoader current>
      {signer => (
        <BitcoinUtxosLoader>
          {utxos => {
            return <BitcoinSwapProvider signer={signer} utxos={utxos} />;
          }}
        </BitcoinUtxosLoader>
      )}
    </BitcoinNativeSegwitAccountLoader>
  );
}
