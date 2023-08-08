import { Suspense } from 'react';

import { StackProps } from '@stacks/ui';

import { SpaceBetween } from '@app/components/layout/space-between';
import { useSwapFeature } from '@app/features/swap';

import { BuyButton } from './buy-button';
import { ReceiveButton } from './receive-button';
import { SendButton } from './send-button';
import { SwapButton } from './swap-button';

export function HomeActions(props: StackProps) {
  const { swapIsEnabled } = useSwapFeature();

  return (
    <Suspense fallback={<></>}>
      <SpaceBetween isInline mt={['base', 'base', 'unset']} width={['100%', 'unset']} {...props}>
        <SendButton />
        <ReceiveButton />
        <BuyButton />
        {swapIsEnabled && <SwapButton />}
      </SpaceBetween>
    </Suspense>
  );
}
