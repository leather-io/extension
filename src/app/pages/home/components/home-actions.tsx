import { Suspense } from 'react';

import { StackProps } from '@stacks/ui';

import { SWAP_ENABLED } from '@shared/environment';

import { SpaceBetween } from '@app/components/layout/space-between';

import { BuyButton } from './buy-button';
import { ReceiveButton } from './receive-button';
import { SendButton } from './send-button';
import { SwapButton } from './swap-button';

export function HomeActions(props: StackProps) {
  return (
    <Suspense fallback={<></>}>
      <SpaceBetween isInline mt={['base', 'base', 'unset']} width={['100%', 'unset']} {...props}>
        <SendButton />
        <ReceiveButton />
        <BuyButton />
        {SWAP_ENABLED && <SwapButton />}
      </SpaceBetween>
    </Suspense>
  );
}
