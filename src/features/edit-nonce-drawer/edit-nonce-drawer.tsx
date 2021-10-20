import React, { useCallback } from 'react';
import { Stack } from '@stacks/ui';

import { useDrawers } from '@common/hooks/use-drawers';
import { LoadingKeys, useLoading } from '@common/hooks/use-loading';
import { openInNewTab } from '@common/utils/open-in-new-tab';
import { ControlledDrawer } from '@components/drawer/controlled';
import { Link } from '@components/link';
import { Caption } from '@components/typography';
import { useShowEditNonceCleanupEffect } from '@store/ui/ui.hooks';

import { EditNonceForm } from './components/edit-nonce-form';

const URL = 'https://www.hiro.so/questions/transactions-advanced-settings';

const CustomFeeMessaging = () => {
  return (
    <Caption>
      If your transaction has been pending for a long time, its nonce might not be correct.{' '}
      <Link fontSize="14px" onClick={() => openInNewTab(URL)}>
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
