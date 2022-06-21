import { useCallback, useEffect, useState } from 'react';
import { Stack } from '@stacks/ui';

import { useDrawers } from '@app/common/hooks/use-drawers';
import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { ControlledDrawer } from '@app/components/drawer/controlled-drawer';
import { Link } from '@app/components/link';
import { Caption } from '@app/components/typography';
import { useShowEditNonceCleanupEffect } from '@app/store/ui/ui.hooks';

import { EditNonceForm } from './components/edit-nonce-form';
import { useFormikContext } from 'formik';
import { TransactionFormValues } from '@app/common/transactions/transaction-utils';

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
  const { errors, setFieldError, setFieldValue, validateField, values } =
    useFormikContext<TransactionFormValues>();
  const [customNonce, setCustomNonce] = useState<number | string>();
  const { showEditNonce, setShowEditNonce } = useDrawers();

  useShowEditNonceCleanupEffect();

  useEffect(() => {
    if (showEditNonce) setCustomNonce(values.nonce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showEditNonce]);

  const onBlur = useCallback(() => {
    validateField('nonce');
  }, [validateField]);

  const onSubmit = useCallback(() => {
    if (!errors.nonce) {
      setShowEditNonce(false);
    }
  }, [errors.nonce, setShowEditNonce]);

  const onClose = useCallback(() => {
    setFieldError('nonce', '');
    setFieldValue('nonce', customNonce);
    setShowEditNonce(false);
  }, [customNonce, setFieldError, setFieldValue, setShowEditNonce]);

  return (
    <ControlledDrawer title="Edit nonce" isShowing={!!showEditNonce} onClose={onClose}>
      <Stack px="loose" spacing="loose" pb="extra-loose">
        <CustomFeeMessaging />
        {showEditNonce && <EditNonceForm onBlur={onBlur} onClose={onClose} onSubmit={onSubmit} />}
      </Stack>
    </ControlledDrawer>
  );
}
