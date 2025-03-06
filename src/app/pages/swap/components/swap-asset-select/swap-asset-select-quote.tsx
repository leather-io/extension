import { useField } from 'formik';

import {
  formatMoneyWithoutSymbol,
  i18nFormatCurrency,
  isDefined,
  isMoneyGreaterThanZero,
} from '@leather.io/utils';

import { RouteUrls } from '@shared/route-urls';

import { LoadingSpinner } from '@app/components/loading-spinner';

import { useSwapNavigate } from '../../hooks/use-swap-navigate';
import { type BaseSwapContext, useSwapContext } from '../../swap.context';
import { convertInputAmountValueToFiat } from '../../swap.utils';
import { SwapAmountField } from './components/swap-amount-field';
import { SwapAssetSelectLayout } from './components/swap-asset-select.layout';

export function SwapAssetSelectQuote<T extends BaseSwapContext<T>>() {
  const { isCrossChainSwap, isFetchingExchangeRate } = useSwapContext<T>();
  const [amountField] = useField('swapAmountQuote');
  const [assetField] = useField('swapAssetQuote');
  const swapNavigate = useSwapNavigate();

  const amountAsFiat =
    isDefined(assetField.value && amountField.value) &&
    convertInputAmountValueToFiat(
      assetField.value.balance,
      assetField.value.marketData,
      amountField.value
    );

  return (
    <SwapAssetSelectLayout
      caption="You have"
      icon={assetField.value?.icon}
      name="swapAmountQuote"
      onSelectAsset={() => swapNavigate(RouteUrls.SwapAssetSelectQuote)}
      showToggle={!isCrossChainSwap}
      swapAmountInput={
        isFetchingExchangeRate ? (
          <LoadingSpinner justifyContent="flex-end" size="sm" />
        ) : (
          <SwapAmountField
            amountAsFiat={
              amountAsFiat && isMoneyGreaterThanZero(amountAsFiat)
                ? i18nFormatCurrency(amountAsFiat)
                : ''
            }
            isDisabled
            name="swapAmountQuote"
          />
        )
      }
      symbol={assetField.value?.name ?? 'Select asset'}
      title="You receive"
      value={assetField.value?.balance ? formatMoneyWithoutSymbol(assetField.value?.balance) : '0'}
    />
  );
}
