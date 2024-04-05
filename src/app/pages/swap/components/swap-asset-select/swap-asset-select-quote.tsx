import { useField } from 'formik';

import { RouteUrls } from '@shared/route-urls';

import { useAlexSdkAmountAsFiat } from '@app/common/hooks/use-alex-sdk';
import { formatMoneyWithoutSymbol } from '@app/common/money/format-money';
import { LoadingSpinner } from '@app/components/loading-spinner';

import { useSwapNavigate } from '../../hooks/use-swap-navigate';
import { useSwapContext } from '../../swap.context';
import { SwapAmountField } from './components/swap-amount-field';
import { SwapAssetSelectLayout } from './components/swap-asset-select.layout';

export function SwapAssetSelectQuote() {
  const { isFetchingExchangeRate } = useSwapContext();
  const [amountField] = useField('swapAmountQuote');
  const [assetField] = useField('swapAssetQuote');
  const navigate = useSwapNavigate();

  const amountAsFiat = useAlexSdkAmountAsFiat(
    assetField.value?.balance,
    assetField.value?.price,
    amountField.value
  );

  return (
    <SwapAssetSelectLayout
      caption="You have"
      icon={assetField.value?.icon}
      name="swapAmountQuote"
      onSelectAsset={() => navigate(RouteUrls.SwapAssetSelectQuote)}
      showToggle
      swapAmountInput={
        isFetchingExchangeRate ? (
          <LoadingSpinner justifyContent="flex-end" size="sm" />
        ) : (
          <SwapAmountField amountAsFiat={amountAsFiat} isDisabled name="swapAmountQuote" />
        )
      }
      symbol={assetField.value?.name ?? 'Select asset'}
      title="You receive"
      value={assetField.value?.balance ? formatMoneyWithoutSymbol(assetField.value?.balance) : '0'}
    />
  );
}
