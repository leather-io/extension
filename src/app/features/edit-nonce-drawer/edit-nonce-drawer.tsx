import { useCallback } from 'react';
import { Stack } from '@stacks/ui';

import { useDrawers } from '@app/common/hooks/use-drawers';
import { LoadingKeys, useLoading } from '@app/common/hooks/use-loading';
import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { ControlledDrawer } from '@app/components/drawer/controlled';
import { Link } from '@app/components/link';
import { Caption } from '@app/components/typography';
import { useShowEditNonceCleanupEffect } from '@app/store/ui/ui.hooks';

import { EditNonceForm } from './components/edit-nonce-form';

const url = 'https://www.hiro.so/questions/transactions-advanced-settings';

const CustomFeeMessaging = () => {
  return (
    <Caption>
      If your transaction has been pending for a long time, its nonce might not be correct.{' '}
      <Link fontSize="14px" onClick={() => openInNewTab(url)}>
        Learn more.
      </Link>
    </Caption>
  );
};

export function EditNonceDrawer(): JSX.Element {
  const { showEditNonce, setShowEditNonce } = useDrawers();
  const { isLoading, setIsIdle } = useLoading(LoadingKeys.EDIT_NONCE_DRAWER);

  useShowEditNonceCleanupEffect();

  const handleOnClose = useCallback(() => {
    setShowEditNonce(false);
    if (isLoading) setIsIdle();
  }, [isLoading, setIsIdle, setShowEditNonce]);

  return (
    <ControlledDrawer title="Edit nonce" isShowing={!!showEditNonce} onClose={handleOnClose}>
      <Stack px="loose" spacing="loose" pb="extra-loose">
        <CustomFeeMessaging />
        {showEditNonce && <EditNonceForm onClose={handleOnClose} />}
      </Stack>
    </ControlledDrawer>
  );
}
