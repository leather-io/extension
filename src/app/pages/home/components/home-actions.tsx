import { Stack, StackProps } from '@stacks/ui';

import { BuyButton } from './buy-button';
import { ReceiveButton } from './receive-button';
import { SendButton } from './send-button';

export const HomeActions = (props: StackProps) => {
  return (
    <Stack isInline mt={['base', 'base', 'unset']} spacing="base-tight" {...props}>
      <SendButton />
      <ReceiveButton />
      <BuyButton />
    </Stack>
  );
};
