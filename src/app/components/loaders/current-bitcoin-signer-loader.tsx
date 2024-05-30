import type { P2Ret, P2TROut } from '@scure/btc-signer/payment';

import { ZERO_INDEX } from '@shared/constants';

import type { Signer } from '@app/store/accounts/blockchain/bitcoin/bitcoin-signer';
import { useCurrentAccountNativeSegwitSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentAccountTaprootSigner } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';

interface CurrentBitcoinSignerLoaderProps {
  children(data: { nativeSegwit: Signer<P2Ret>; taproot: Signer<P2TROut> }): React.ReactNode;
}
export function CurrentBitcoinSignerLoader({ children }: CurrentBitcoinSignerLoaderProps) {
  const nativeSegwit = useCurrentAccountNativeSegwitSigner()?.(ZERO_INDEX);
  const taproot = useCurrentAccountTaprootSigner()?.(ZERO_INDEX);
  if (!taproot || !nativeSegwit) return null;
  return children({ nativeSegwit, taproot });
}
