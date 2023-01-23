import { useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Stack } from '@stacks/ui';
import { useFormikContext } from 'formik';
import get from 'lodash.get';

import { StacksSendFormValues, StacksTransactionFormValues } from '@shared/models/form.model';

import { useOnMount } from '@app/common/hooks/use-on-mount';
import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { BaseDrawer } from '@app/components/drawer/base-drawer';
import { Link } from '@app/components/link';
import { Caption } from '@app/components/typography';

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
  const { errors, setFieldError, setFieldValue, validateField, values } = useFormikContext<
    StacksSendFormValues | StacksTransactionFormValues
  >();
  const [loadedNextNonce, setLoadedNextNonce] = useState<number | string>();
  const location = useLocation();
  const navigate = useNavigate();

  const contractId = get(location.state, 'contractId');

  useOnMount(() => setLoadedNextNonce(values.nonce));

  const onGoBack = useCallback(
    () => navigate('..', { state: { contractId } }),
    [contractId, navigate]
  );

  const onBlur = useCallback(() => {
    validateField('nonce');
  }, [validateField]);

  const onSubmit = useCallback(async () => {
    validateField('nonce');
    if (!errors.nonce) onGoBack();
  }, [errors.nonce, onGoBack, validateField]);

  const onClose = useCallback(() => {
    if (!values.nonce) setFieldValue('nonce', undefined);
    setFieldError('nonce', '');
    setFieldValue('nonce', loadedNextNonce);
    onGoBack();
  }, [loadedNextNonce, onGoBack, setFieldError, setFieldValue, values.nonce]);

  return (
    <BaseDrawer isShowing onClose={onClose} pauseOnClickOutside title="Edit nonce">
      <Stack pb="extra-loose" px="loose" spacing="loose">
        <CustomFeeMessaging />
        <EditNonceForm onBlur={onBlur} onClose={onClose} onSubmit={onSubmit} />
      </Stack>
    </BaseDrawer>
  );
}
