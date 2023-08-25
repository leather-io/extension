import { SwapAmountField } from './swap-amount-field';
import { SwapSelectedAssetLayout } from './swap-selected-asset.layout';

interface SwapSelectedAssetPlaceholderProps {
  onChooseAsset(): void;
  showToggle?: boolean;
  title: string;
}
export function SwapSelectedAssetPlaceholder({
  onChooseAsset,
  showToggle,
  title,
}: SwapSelectedAssetPlaceholderProps) {
  return (
    <SwapSelectedAssetLayout
      onChooseAsset={onChooseAsset}
      name=""
      showToggle={showToggle}
      swapAmountInput={<SwapAmountField amountAsFiat="" isDisabled name="" />}
      symbol="Select asset"
      title={title}
      value="0"
    />
  );
}
