import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { Flex, Stack } from 'leather-styles/jsx';

import { BaseDrawer } from '@app/components/drawer/base-drawer';
import { Spinner } from '@app/ui/components/spinner';
import { Caption } from '@app/ui/components/typography/caption';

interface IncreaseFeeDrawerProps {
  feeForm: React.JSX.Element;
  onClose(): void;
  isShowing: boolean;
}
export function IncreaseFeeDrawer({ feeForm, onClose, isShowing }: IncreaseFeeDrawerProps) {
  return (
    <>
      <BaseDrawer isShowing={isShowing} onClose={onClose} title="Increase transaction fee">
        <Stack gap="space.05" px="space.05" pb="space.05">
          <Suspense
            fallback={
              <Flex alignItems="center" justifyContent="center" p="space.06">
                <Spinner />
              </Flex>
            }
          >
            <Caption>
              If your transaction is pending for a long time, its fee might not be high enough to be
              included in a block. Update the fee for a higher value and try again.
            </Caption>
            {feeForm && feeForm}
          </Suspense>
        </Stack>
      </BaseDrawer>
      <Outlet />
    </>
  );
}
