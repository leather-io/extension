import type { StxAccountCryptoAssetWithDetails } from '@app/query/models/crypto-asset.model';
import { useStxAccountCryptoAssetWithDetails } from '@app/query/stacks/stx/stx-crypto-asset.hooks';

interface StxCryptoAssetLoaderProps {
  address: string;
  children(asset: StxAccountCryptoAssetWithDetails, isInitialLoading: boolean): React.ReactNode;
}
export function StxCryptoAssetLoader({ address, children }: StxCryptoAssetLoaderProps) {
  const { asset, isInitialLoading } = useStxAccountCryptoAssetWithDetails(address);
  return children(asset, isInitialLoading);
}
