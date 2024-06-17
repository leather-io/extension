import { useNavigate } from 'react-router-dom';

import { useFormikContext } from 'formik';
import { styled } from 'leather-styles/jsx';

import { isDefined, isUndefined } from '@leather-wallet/utils';

import { RouteUrls } from '@shared/route-urls';

import { SwapIcon } from '@app/ui/icons';

import { SwapFormValues } from '../../../hooks/use-swap-form';
import { useSwapContext } from '../../../swap.context';

export function SwapToggleButton() {
  const { fetchQuoteAmount, isFetchingExchangeRate, onSetIsSendingMax } = useSwapContext();
  const { setFieldValue, values } = useFormikContext<SwapFormValues>();
  const navigate = useNavigate();

  async function onToggleSwapAssets() {
    onSetIsSendingMax(false);

    const prevAmountBase = values.swapAmountBase;
    const prevAmountQuote = values.swapAmountQuote;
    const prevAssetBase = values.swapAssetBase;
    const prevAssetQuote = values.swapAssetQuote;

    void setFieldValue('swapAssetBase', prevAssetQuote);
    void setFieldValue('swapAssetQuote', prevAssetBase);
    void setFieldValue('swapAmountBase', prevAmountQuote);

    if (isDefined(prevAssetBase) && isDefined(prevAssetQuote)) {
      const quoteAmount = await fetchQuoteAmount(prevAssetQuote, prevAssetBase, prevAmountQuote);
      if (isUndefined(quoteAmount)) {
        void setFieldValue('swapAmountQuote', '');
        return;
      }
      void setFieldValue('swapAmountQuote', Number(quoteAmount));
    } else {
      void setFieldValue('swapAmountQuote', Number(prevAmountBase));
    }
    navigate(
      RouteUrls.Swap.replace(':base', prevAssetQuote?.name ?? '').replace(
        ':quote',
        prevAssetBase?.name ?? ''
      )
    );
  }

  return (
    <styled.button
      alignSelf="flex-start"
      disabled={isUndefined(values.swapAssetQuote) || isFetchingExchangeRate}
      onClick={onToggleSwapAssets}
      type="button"
    >
      <SwapIcon transform="rotate(90deg)" variant="small" />
    </styled.button>
  );
}
