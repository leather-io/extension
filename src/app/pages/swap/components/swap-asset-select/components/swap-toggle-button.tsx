import { useNavigate } from 'react-router-dom';

import { useFormikContext } from 'formik';
import { styled } from 'leather-styles/jsx';

import { RouteUrls } from '@shared/route-urls';
import { isDefined, isUndefined } from '@shared/utils';

import { SwapIcon } from '@app/ui/icons';

import { SwapFormValues } from '../../../hooks/use-swap-form';
import { useSwapContext } from '../../../swap.context';

export function SwapToggleButton() {
  const { fetchToAmount, isFetchingExchangeRate, onSetIsSendingMax } = useSwapContext();
  const { setFieldValue, validateForm, values } = useFormikContext<SwapFormValues>();
  const navigate = useNavigate();

  async function onToggleSwapAssets() {
    onSetIsSendingMax(false);

    const prevAmountBase = values.swapAmountBase;
    const prevAmountQuote = values.swapAmountQuote;
    const prevAssetBase = values.swapAssetBase;
    const prevAssetQuote = values.swapAssetQuote;

    await setFieldValue('swapAssetBase', prevAssetQuote);
    await setFieldValue('swapAssetQuote', prevAssetBase);
    await setFieldValue('swapAmountBase', prevAmountQuote);

    if (isDefined(prevAssetBase) && isDefined(prevAssetQuote)) {
      const quoteAmount = await fetchToAmount(prevAssetQuote, prevAssetBase, prevAmountQuote);
      if (isUndefined(quoteAmount)) {
        await setFieldValue('swapAmountQuote', '');
        return;
      }
      await setFieldValue('swapAmountQuote', Number(quoteAmount));
    } else {
      await setFieldValue('swapAmountQuote', Number(prevAmountBase));
    }
    await validateForm();
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
