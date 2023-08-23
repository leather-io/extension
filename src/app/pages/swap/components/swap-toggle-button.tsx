import { useFormikContext } from 'formik';
import { styled } from 'leather-styles/jsx';

import { SwapIcon } from '@app/components/icons/swap-icon';

import { SwapFormValues } from '../hooks/use-swap';
import { useSwapContext } from '../swap.context';

export function SwapToggleButton() {
  const { fetchToAmount } = useSwapContext();
  const { setFieldValue, values } = useFormikContext<SwapFormValues>();

  async function onToggleSwapAssets() {
    const prevAmountFrom = values.swapAmountFrom;
    const prevAmountTo = values.swapAmountTo;
    const prevAssetFrom = values.swapAssetFrom;
    const prevAssetTo = values.swapAssetTo;

    await setFieldValue('swapAssetFrom', prevAssetTo);
    await setFieldValue('swapAssetTo', prevAssetFrom);
    await setFieldValue('swapAmountFrom', prevAmountTo);
    if (prevAssetFrom != null && prevAssetTo != null && !isNaN(Number(prevAmountTo))) {
      const to = await fetchToAmount(prevAssetTo, prevAssetFrom, prevAmountTo);
      await setFieldValue('swapAmountTo', to);
    } else {
      await setFieldValue('swapAmountTo', prevAmountFrom);
    }
  }

  return (
    <styled.button alignSelf="flex-start" onClick={onToggleSwapAssets}>
      <SwapIcon transform="rotate(90)" />
    </styled.button>
  );
}
