import { useField } from 'formik';

import { formatMoneyWithoutSymbol } from '@app/common/money/format-money';

import { useAmountAsFiat } from '../hooks/use-amount-as-fiat';
import { SwapAmountField } from './swap-amount-field';
import { SwapSelectedAssetLayout } from './swap-selected-asset.layout';

interface SwapSelectedAssetToProps {
  onChooseAsset(): void;
  title: string;
}
export function SwapSelectedAssetTo({ onChooseAsset, title }: SwapSelectedAssetToProps) {
  const [amountField] = useField('swapAmountTo');
  const [assetField] = useField('swapAssetTo');

  const amountAsFiat = useAmountAsFiat(assetField.value.balance, amountField.value);

  return (
    <SwapSelectedAssetLayout
      caption="You have"
      icon={assetField.value.icon}
      name="swapAmountTo"
      onChooseAsset={onChooseAsset}
      showToggle
      swapAmountInput={
        <SwapAmountField amountAsFiat={amountAsFiat} isDisabled name="swapAmountTo" />
      }
      symbol={assetField.value.balance.symbol}
      title={title}
      value={formatMoneyWithoutSymbol(assetField.value.balance)}
    />
  );
}
