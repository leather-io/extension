import { useParams } from 'react-router-dom';

import { BitcoinNativeSegwitAccountLoader } from '@app/components/loaders/bitcoin-account-loader';

import { generateSwapRoutes } from './generate-swap-routes';
import { BitcoinUtxosLoader } from './loaders/bitcoin-utxos-loader';
import { StacksNonceLoader } from './loaders/stacks-nonce-loader';
import { BitcoinSwapProvider } from './providers/bitcoin-swap-provider';
import { StacksSwapProvider } from './providers/stacks-swap-provider';

export const swapRoutes = generateSwapRoutes(<SwapContainer />);

function SwapContainer() {
  const { origin } = useParams();

  switch (origin) {
    case 'bitcoin':
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
    case 'stacks':
      return (
        <StacksNonceLoader>
          {nonce => {
            return <StacksSwapProvider nonce={nonce} />;
          }}
        </StacksNonceLoader>
      );
    default:
      return null;
  }
}
