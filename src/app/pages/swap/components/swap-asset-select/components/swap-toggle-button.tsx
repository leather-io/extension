import { useFormikContext } from 'formik';
import { styled } from 'leather-styles/jsx';

import { isDefined, isUndefined } from '@shared/utils';

import { SwapIcon } from '@app/ui/icons';

import { SwapFormValues } from '../../../hooks/use-swap-form';
import { useSwapContext } from '../../../swap.context';

export function SwapToggleButton() {
  const { fetchToAmount, isFetchingExchangeRate, onSetIsSendingMax } = useSwapContext();
  const { setFieldValue, validateForm, values } = useFormikContext<SwapFormValues>();

  async function onToggleSwapAssets() {
    onSetIsSendingMax(false);

    const prevAmountFrom = values.swapAmountBase;
    const prevAmountTo = values.swapAmountQuote;
    const prevAssetFrom = values.swapAssetBase;
    const prevAssetTo = values.swapAssetQuote;

    await setFieldValue('swapAssetBase', prevAssetTo);
    await setFieldValue('swapAssetQuote', prevAssetFrom);
    await setFieldValue('swapAmountBase', prevAmountTo);

    if (isDefined(prevAssetFrom) && isDefined(prevAssetTo)) {
      const toAmount = await fetchToAmount(prevAssetTo, prevAssetFrom, prevAmountTo);
      if (isUndefined(toAmount)) {
        await setFieldValue('swapAmountQuote', '');
        return;
      }
      await setFieldValue('swapAmountQuote', Number(toAmount));
    } else {
      await setFieldValue('swapAmountQuote', Number(prevAmountFrom));
    }
    await validateForm();
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
