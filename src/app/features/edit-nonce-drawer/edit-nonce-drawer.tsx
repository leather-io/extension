import { useCallback, useEffect, useState } from 'react';

import { Stack } from '@stacks/ui';
import { useFormikContext } from 'formik';

import { TransactionFormValues } from '@shared/models/form.model';
import { isUndefined } from '@shared/utils';

import { useDrawers } from '@app/common/hooks/use-drawers';
import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { ControlledDrawer } from '@app/components/drawer/controlled-drawer';
import { Link } from '@app/components/link';
import { Caption } from '@app/components/typography';
import { useNextNonce } from '@app/query/stacks/nonce/account-nonces.hooks';
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

export function EditNonceDrawer() {
  const { errors, setFieldError, setFieldValue, validateField, values } =
    useFormikContext<TransactionFormValues>();
  const [customNonce, setCustomNonce] = useState<number | string>();
  const { nonce } = useNextNonce();
  const { isShowingEditNonce, setIsShowingEditNonce } = useDrawers();
  useShowEditNonceCleanupEffect();

  useEffect(() => {
    if (isShowingEditNonce) setCustomNonce(values.nonce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShowingEditNonce]);

  useEffect(() => {
    if (isUndefined(values.nonce)) setFieldValue('nonce', nonce);
  }, [nonce, setFieldValue, values.nonce]);

  const onBlur = useCallback(() => {
    validateField('nonce');
  }, [validateField]);

  const onSubmit = useCallback(async () => {
    validateField('nonce');
    if (!errors.nonce) {
      setIsShowingEditNonce(false);
    }
  }, [errors.nonce, setIsShowingEditNonce, validateField]);

  const onClose = useCallback(() => {
    if (!values.nonce) setFieldValue('nonce', undefined);
    setFieldError('nonce', '');
    setFieldValue('nonce', customNonce);
    setIsShowingEditNonce(false);
  }, [customNonce, setFieldError, setFieldValue, setIsShowingEditNonce, values.nonce]);

  return (
    <ControlledDrawer
      isShowing={!!isShowingEditNonce}
      onClose={onClose}
      pauseOnClickOutside
      title="Edit nonce"
    >
      <Stack px="loose" spacing="loose" pb="extra-loose">
        <CustomFeeMessaging />
        {isShowingEditNonce && (
          <EditNonceForm onBlur={onBlur} onClose={onClose} onSubmit={onSubmit} />
        )}
      </Stack>
    </ControlledDrawer>
  );
}
