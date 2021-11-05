import { Stack, StackProps } from '@stacks/ui';
import { RouteUrls } from '@common/types';
import React from 'react';
import { TxButton } from './tx-button';
import { SendButton } from './send-button';

export const HomeActions: React.FC<StackProps> = props => {
  return (
    <Stack isInline spacing="base-tight" {...props}>
      <SendButton />
      <TxButton path={RouteUrls.ReceiveTokens} kind="receive" />
    </Stack>
  );
};
