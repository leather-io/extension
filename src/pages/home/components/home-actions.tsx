import { Stack, StackProps } from '@stacks/ui';
import React from 'react';
import { ReceiveTxButton } from './tx-button';
import { SendBuyButton } from './send-button';

export const HomeActions: React.FC<StackProps> = props => {
  return (
    <React.Suspense fallback={<></>}>
      <Stack isInline spacing="base-tight" {...props}>
        <SendBuyButton />
        <ReceiveTxButton />
      </Stack>
    </React.Suspense>
  );
};
