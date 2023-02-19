import { Suspense } from 'react';

import { Box, BoxProps } from '@stacks/ui';
import { memoWithAs } from '@stacks/ui-core';
import { truncateMiddle } from '@stacks/ui-utils';

import { LoadingRectangle } from '@app/components/loading-rectangle';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

const CurrentStxAddressSuspense = memoWithAs((props: BoxProps) => {
  const currentAccount = useCurrentStacksAccount();
  if (!currentAccount) return null;
  return <Box {...props}>{truncateMiddle(currentAccount.address, 4)}</Box>;
});

export const CurrentStxAddress = memoWithAs((props: BoxProps) => {
  return (
    <Suspense fallback={<LoadingRectangle height="16px" width="50px" {...props} />}>
      <CurrentStxAddressSuspense {...props} />
    </Suspense>
  );
});
