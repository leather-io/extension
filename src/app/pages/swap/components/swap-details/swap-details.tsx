import { Text } from '@stacks/ui';

import { SwapDetail } from './swap-detail';
import { SwapDetailsLayout } from './swap-details.layout';

// TODO: Replace with live data
export function SwapDetails() {
  return (
    <>
      <Text alignSelf="flex-start" fontWeight={500} pt="tight" my="base">
        Swap details
      </Text>
      <SwapDetailsLayout>
        <SwapDetail title="Placeholder" tooltipLabel="Tooltip info" value="0" />
        <SwapDetail title="Placeholder" value="0" />
        <SwapDetail title="Placeholder" value="0" />
        <SwapDetail title="Placeholder" value="0" />
      </SwapDetailsLayout>
    </>
  );
}
