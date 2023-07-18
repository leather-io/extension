import { Suspense } from 'react';

import { Stack, StackProps } from '@stacks/ui';

import { useSwapFeature } from '@app/features/swap';

import { BuyButton } from './buy-button';
import { ReceiveButton } from './receive-button';
import { SendButton } from './send-button';
import { SwapButton } from './swap-button';

export function HomeActions(props: StackProps) {
  const { swapIsEnabled } = useSwapFeature();

  return (
    <Suspense fallback={<></>}>
      <Stack isInline mt={['base', 'base', 'unset']} spacing="base-tight" {...props}>
        <SendButton />
        <ReceiveButton />
        <BuyButton />
        {swapIsEnabled && <SwapButton />}
      </Stack>
    </Suspense>
  );
}
