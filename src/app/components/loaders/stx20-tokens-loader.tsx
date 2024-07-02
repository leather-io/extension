import type { CryptoAssetBalance, Stx20CryptoAssetInfo } from '@leather.io/models';
import { useStx20Tokens } from '@leather.io/query';

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
