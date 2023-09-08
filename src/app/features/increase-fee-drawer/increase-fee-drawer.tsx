import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

// #4164 FIXME migrate Spinner
import { Spinner } from '@stacks/ui';
import { Flex, Stack } from 'leather-styles/jsx';

import { BaseDrawer } from '@app/components/drawer/base-drawer';
import { Caption } from '@app/components/typography';

interface IncreaseFeeDrawerProps {
  feeForm: React.JSX.Element;
  onClose: () => void;
  isShowing: boolean;
}

export function IncreaseFeeDrawer({ feeForm, onClose, isShowing }: IncreaseFeeDrawerProps) {
  return (
    <>
      <BaseDrawer isShowing={isShowing} onClose={onClose} title="Increase transaction fee">
        <Stack px="space.05" gap="space.05" pb="space.06">
          <Suspense
            fallback={
              <Flex alignItems="center" justifyContent="center" p="space.06">
                <Spinner />
              </Flex>
            }
          >
            <Caption>
              If your transaction is pending for a long time, its fee might not be high enough to be
              included in a clock. Update the fee for a higher value and try again.
            </Caption>
            {feeForm && feeForm}
          </Suspense>
        </Stack>
      </BaseDrawer>
      <Outlet />
    </>
  );
}
