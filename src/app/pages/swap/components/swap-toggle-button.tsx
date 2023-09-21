import { useFormikContext } from 'formik';
import { styled } from 'leather-styles/jsx';

import { isDefined } from '@shared/utils';

import { SwapIcon } from '@app/components/icons/swap-icon';

import { SwapFormValues } from '../hooks/use-swap';
import { useSwapContext } from '../swap.context';

export function SwapToggleButton() {
  const { fetchToAmount, onSetIsSendingMax } = useSwapContext();
  const { setFieldValue, values } = useFormikContext<SwapFormValues>();

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
      await setFieldValue('swapAmountTo', Number(toAmount));
    } else {
      await setFieldValue('swapAmountTo', Number(prevAmountFrom));
    }
  }

  return (
    <styled.button alignSelf="flex-start" onClick={onToggleSwapAssets}>
      <SwapIcon transform="rotate(90)" />
    </styled.button>
  );
}
