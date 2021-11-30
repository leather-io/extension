import { Stack, StackProps } from '@stacks/ui';
import { RouteUrls } from '@routes/route-urls';
import React from 'react';
import { TxButton } from './tx-button';
import { SendButton } from './send-button';

export const HomeActions: React.FC<StackProps> = props => {
  return (
    <Stack isInline spacing="base-tight" {...props}>
      <SendButton />
      <TxButton path={RouteUrls.Receive} kind="receive" />
    </Stack>
  );
};
