import { useBrc20AccountCryptoAssetsWithDetails } from '@app/query/bitcoin/ordinals/brc20/brc20-tokens.hooks';
import type { Brc20AccountCryptoAssetWithDetails } from '@app/query/models/crypto-asset.model';

interface Brc20TokensLoaderProps {
  children(tokens: Brc20AccountCryptoAssetWithDetails[]): React.ReactNode;
}
export function Brc20TokensLoader({ children }: Brc20TokensLoaderProps) {
  const tokens = useBrc20AccountCryptoAssetsWithDetails();
  return children(tokens);
}
