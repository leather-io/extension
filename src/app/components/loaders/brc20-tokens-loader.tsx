import { type Brc20Token, useBrc20Tokens } from '@leather-wallet/query';

import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentAccountTaprootSigner } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';

interface Brc20TokensLoaderProps {
  children(tokens: Brc20Token[]): React.ReactNode;
}
export function Brc20TokensLoader({ children }: Brc20TokensLoaderProps) {
  const nativeSegwitSigner = useCurrentAccountNativeSegwitIndexZeroSigner();
  const createTaprootSigner = useCurrentAccountTaprootSigner();
  const tokens = useBrc20Tokens({
    createTaprootSigner,
    nativeSegwitAddress: nativeSegwitSigner.address,
  });
  return children(tokens);
}
