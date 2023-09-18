import { useField } from 'formik';

import { formatMoneyWithoutSymbol } from '@app/common/money/format-money';

import { useAmountAsFiat } from '../hooks/use-fiat-price';
import { SwapAmountField } from './swap-amount-field';
import { SwapSelectedAssetLayout } from './swap-selected-asset.layout';

interface SwapSelectedAssetToProps {
  onChooseAsset(): void;
  title: string;
}
export function SwapSelectedAssetTo({ onChooseAsset, title }: SwapSelectedAssetToProps) {
  const [amountField] = useField('swapAmountTo');
  const [assetField] = useField('swapAssetTo');

  const amountAsFiat = useAmountAsFiat(
    assetField.value?.balance,
    assetField.value?.price,
    amountField.value
  );

  return (
    <SwapSelectedAssetLayout
      caption="You have"
      icon={assetField.value?.icon}
      name="swapAmountTo"
      onChooseAsset={onChooseAsset}
      showToggle
      swapAmountInput={
        <SwapAmountField amountAsFiat={amountAsFiat} isDisabled name="swapAmountTo" />
      }
      symbol={assetField.value?.balance.symbol ?? 'Select asset'}
      title={title}
      value={assetField.value?.balance ? formatMoneyWithoutSymbol(assetField.value?.balance) : '0'}
    />
  );
}
