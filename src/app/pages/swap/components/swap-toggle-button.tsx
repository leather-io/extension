import { Box } from '@stacks/ui';
import { useFormikContext } from 'formik';

import { SwapIcon } from '@app/components/icons/swap-icon';

import { SwapFormValues } from '../hooks/use-swap';
import { useSwapContext } from '../swap.context';

export function SwapToggleButton() {
  const { onSetIsSendingMax } = useSwapContext();
  const { setFieldValue, values } = useFormikContext<SwapFormValues>();

  async function onToggleSwapAssets() {
    onSetIsSendingMax(false);
    const prevAmountFrom = values.swapAmountFrom;
    const prevAmountTo = values.swapAmountTo;
    const prevAssetFrom = values.swapAssetFrom;
    const prevAssetTo = values.swapAssetTo;

    await setFieldValue('swapAmountFrom', prevAmountTo);
    await setFieldValue('swapAmountTo', prevAmountFrom);
    await setFieldValue('swapAssetFrom', prevAssetTo);
    await setFieldValue('swapAssetTo', prevAssetFrom);
  }

  return (
    <Box alignSelf="flex-start" as="button" onClick={onToggleSwapAssets} size="24px" type="button">
      <SwapIcon />
    </Box>
  );
}
