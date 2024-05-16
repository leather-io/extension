import type { CryptoAssetBalance, Stx20CryptoAssetInfo } from '@leather-wallet/models';

import { useStx20Tokens } from '@app/query/stacks/stx20/stx20-tokens.hooks';

interface Stx20TokensLoaderProps {
  address: string;
  children(
    tokens: {
      balance: CryptoAssetBalance;
      info: Stx20CryptoAssetInfo;
    }[]
  ): React.ReactNode;
}
export function Stx20TokensLoader({ address, children }: Stx20TokensLoaderProps) {
  const { data: tokens = [] } = useStx20Tokens(address);
  return children(tokens);
}
