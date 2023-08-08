import { Box } from '@stacks/ui';
import { useFormikContext } from 'formik';

import { SwapIcon } from '@app/components/icons/swap-icon';

import { SwapFormValues } from '../hooks/use-swap';

interface SwapToggleButtonProps {
  onSetIsSendingMax(value: boolean): void;
}
export function SwapToggleButton({ onSetIsSendingMax }: SwapToggleButtonProps) {
  const { setFieldValue, values } = useFormikContext<SwapFormValues>();

  async function onToggleSwapAssets() {
    onSetIsSendingMax(false);
    // const prevAmountFrom = values.swapAmountFrom;
    // const prevAmountTo = values.swapAmountTo;
    const prevAssetFrom = values.swapAssetFrom;
    const prevAssetTo = values.swapAssetTo;
    // TODO: Not sure what should happen to amount on toggle?
    await setFieldValue('swapAmountFrom', '0');
    await setFieldValue('swapAmountTo', '0');
    await setFieldValue('swapAssetFrom', prevAssetTo);
    await setFieldValue('swapAssetTo', prevAssetFrom);
  }

  return (
    <Box
      alignSelf="flex-start"
      as="button"
      my="loose"
      onClick={onToggleSwapAssets}
      p="tight"
      size="32px"
      type="button"
    >
      <SwapIcon />
    </Box>
  );
}
