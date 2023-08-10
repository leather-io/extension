import { Suspense } from 'react';

import { Callout, Card, Theme } from '@radix-ui/themes';
import { Stack, StackProps } from '@stacks/ui';

import { BuyButton } from './buy-button';
import { ReceiveButton } from './receive-button';
import { SendButton } from './send-button';

export function HomeActions(props: StackProps) {
  return (
    <Suspense fallback={<></>}>
      <Stack isInline mt={['base', 'base', 'unset']} spacing="base-tight" {...props}>
        <SendButton />
        <ReceiveButton />
        <BuyButton />
        <Theme color="brown">
          <Card variant="surface" color="brown">
            Card
          </Card>

          <Callout.Root style={{ backgroundColor: 'var(--primary-1)' }}>
            <Callout.Icon>
              {/* <InfoCircledIcon /> */}
            </Callout.Icon>
            <Callout.Text>
              You will need admin privileges to install and access this application.
            </Callout.Text>
          </Callout.Root>
        </Theme>
      </Stack>
    </Suspense>
  );
}
