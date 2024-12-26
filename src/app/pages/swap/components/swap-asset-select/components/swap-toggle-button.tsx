import { useNavigate, useParams } from 'react-router-dom';

import { useFormikContext } from 'formik';
import { styled } from 'leather-styles/jsx';

import { ArrowsRepeatLeftRightIcon } from '@leather.io/ui';
import { isDefined, isUndefined } from '@leather.io/utils';

import type { SwapFormValues } from '@shared/models/form.model';
import { RouteUrls } from '@shared/route-urls';

import { type BaseSwapContext, useSwapContext } from '../../../swap.context';

export function SwapToggleButton<T extends BaseSwapContext<T>>() {
  const { isFetchingExchangeRate, onSetIsFetchingExchangeRate, onSetIsSendingMax, swapData } =
    useSwapContext<T>();
  const { fetchQuoteAmount } = swapData;
  const { setFieldValue, values } = useFormikContext<SwapFormValues>();
  const navigate = useNavigate();
  const { origin } = useParams();

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
      onSetIsFetchingExchangeRate(true);
      const quoteAmount = await fetchQuoteAmount(prevAssetQuote, prevAssetBase, prevAmountQuote);
      onSetIsFetchingExchangeRate(false);
      if (isUndefined(quoteAmount)) {
        void setFieldValue('swapAmountQuote', '');
        return;
      }
      void setFieldValue('swapAmountQuote', Number(quoteAmount));
    } else {
      void setFieldValue('swapAmountQuote', Number(prevAmountBase));
    }
    navigate(
      RouteUrls.Swap.replace(':origin', origin ?? '')
        .replace(':base', prevAssetQuote?.name ?? '')
        .replace(':quote', prevAssetBase?.name ?? '')
    );
  }

  return (
    <styled.button
      alignSelf="flex-start"
      disabled={isUndefined(values.swapAssetQuote) || isFetchingExchangeRate}
      onClick={onToggleSwapAssets}
      type="button"
    >
      <ArrowsRepeatLeftRightIcon transform="rotate(90)" variant="small" />
    </styled.button>
  );
}
