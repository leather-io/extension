import { useFormikContext } from 'formik';
import { styled } from 'leather-styles/jsx';

import { isDefined, isUndefined } from '@shared/utils';

import { SwapIcon } from '@app/ui/components/icons/swap-icon';

import { SwapFormValues } from '../hooks/use-swap-form';
import { useSwapContext } from '../swap.context';

export function SwapToggleButton() {
  const { fetchToAmount, isFetchingExchangeRate, onSetIsSendingMax } = useSwapContext();
  const { setFieldValue, validateForm, values } = useFormikContext<SwapFormValues>();

  async function onToggleSwapAssets() {
    onSetIsSendingMax(false);

    const prevAmountFrom = values.swapAmountFrom;
    const prevAmountTo = values.swapAmountTo;
    const prevAssetFrom = values.swapAssetFrom;
    const prevAssetTo = values.swapAssetTo;

    await setFieldValue('swapAssetFrom', prevAssetTo);
    await setFieldValue('swapAssetTo', prevAssetFrom);
    await setFieldValue('swapAmountFrom', prevAmountTo);

    if (isDefined(prevAssetFrom) && isDefined(prevAssetTo)) {
      const toAmount = await fetchToAmount(prevAssetTo, prevAssetFrom, prevAmountTo);
      if (isUndefined(toAmount)) {
        await setFieldValue('swapAmountTo', '');
        return;
      }
      await setFieldValue('swapAmountTo', Number(toAmount));
    } else {
      await setFieldValue('swapAmountTo', Number(prevAmountFrom));
    }
    await validateForm();
  }

  return (
    <styled.button
      alignSelf="flex-start"
      disabled={isUndefined(values.swapAssetTo) || isFetchingExchangeRate}
      onClick={onToggleSwapAssets}
      type="button"
    >
      <SwapIcon transform="rotate(90deg)" />
    </styled.button>
  );
}
