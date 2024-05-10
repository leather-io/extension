import { useBtcAccountCryptoAssetWithDetails } from '@app/query/bitcoin/btc/btc-crypto-asset.hooks';
import type { BtcAccountCryptoAssetWithDetails } from '@app/query/models/crypto-asset.model';

interface BtcCryptoAssetLoaderProps {
  address: string;
  children(asset: BtcAccountCryptoAssetWithDetails, isInitialLoading: boolean): React.ReactNode;
}
export function BtcCryptoAssetLoader({ address, children }: BtcCryptoAssetLoaderProps) {
  const { asset, isInitialLoading } = useBtcAccountCryptoAssetWithDetails(address);
  return children(asset, isInitialLoading);
}
