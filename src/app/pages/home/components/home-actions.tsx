import { Suspense } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { Stack, StackProps } from '@stacks/ui';

import { BuyButton } from './buy-button';
import { ReceiveButton } from './receive-button';
import { SendButton } from './send-button';

export function HomeActions(props: StackProps) {
  const location = useLocation();
  return (
    <Suspense fallback={<></>}>
      <Stack isInline mt={['base', 'base', 'unset']} spacing="base-tight" {...props}>
        <Link to="/pete" state={{ previousLocation: location }}>
          PETE
        </Link>
        <SendButton />
        <ReceiveButton />
        <BuyButton />
      </Stack>
    </Suspense>
  );
}
