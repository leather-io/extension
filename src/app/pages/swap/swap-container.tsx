import { BitcoinNativeSegwitAccountLoader } from '@app/components/loaders/bitcoin-account-loader';

import { generateSwapRoutes } from './generate-swap-routes';
import { BitcoinUtxosLoader } from './loaders/bitcoin-utxos-loader';
import { StacksNonceLoader } from './loaders/stacks-nonce-loader';
import { BitcoinSwapProvider } from './providers/bitcoin-swap-provider';
import { StacksSwapProvider } from './providers/stacks-swap-provider';

export const bitcoinSwapRoutes = generateSwapRoutes('bitcoin', <BitcoinSwapContainer />);
export const stacksSwapRoutes = generateSwapRoutes('stacks', <StacksSwapContainer />);

function BitcoinSwapContainer() {
  return (
    <BitcoinNativeSegwitAccountLoader current>
      {signer => (
        <BitcoinUtxosLoader>
          {utxos => <BitcoinSwapProvider signer={signer} utxos={utxos} />}
        </BitcoinUtxosLoader>
      )}
    </BitcoinNativeSegwitAccountLoader>
  );
}

function StacksSwapContainer() {
  return <StacksNonceLoader>{nonce => <StacksSwapProvider nonce={nonce} />}</StacksNonceLoader>;
}
