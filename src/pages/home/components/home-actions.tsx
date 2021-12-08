import React from 'react';

import { Stack, StackProps } from '@stacks/ui';

import { BuyButton } from './buy-button';
import { SendButton } from './send-button';
import { ReceiveTxButton } from './tx-button';

export const HomeActions: React.FC<StackProps> = props => {
  return (
    <React.Suspense fallback={<></>}>
      <Stack isInline spacing="base-tight" {...props}>
        <SendButton />
        <ReceiveTxButton />
        <BuyButton />
      </Stack>
    </React.Suspense>
  );
};
