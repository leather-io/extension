import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { Flex, Spinner, Stack } from '@stacks/ui';

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
        <Stack px="loose" spacing="loose" pb="extra-loose">
          <Suspense
            fallback={
              <Flex alignItems="center" justifyContent="center" p="extra-loose">
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
