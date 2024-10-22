import { CryptoAssetItemToggle, type CryptoAssetItemToggleProps } from './crypto-asset-item-toggle';
import { CryptoAssetItemLayout, type CryptoAssetItemLayoutProps } from './crypto-asset-item.layout';

interface CryptoAssetItemProps {
  isToggleMode: boolean;
  toggleProps?: CryptoAssetItemToggleProps;
  itemProps?: CryptoAssetItemLayoutProps;
}

export function CryptoAssetItem({ isToggleMode, toggleProps, itemProps }: CryptoAssetItemProps) {
  if (isToggleMode && toggleProps) {
    return <CryptoAssetItemToggle {...toggleProps} />;
  }

  if (itemProps) {
    return <CryptoAssetItemLayout {...itemProps} />;
  }

  return null;
}
