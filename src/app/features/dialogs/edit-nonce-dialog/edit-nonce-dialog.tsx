import { useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useFormikContext } from 'formik';
import { Stack, styled } from 'leather-styles/jsx';

import { Link } from '@leather.io/ui';

import { StacksSendFormValues, StacksTransactionFormValues } from '@shared/models/form.model';

import { useOnMount } from '@app/common/hooks/use-on-mount';
import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { Dialog } from '@app/ui/components/containers/dialog/dialog';
import { DialogHeader } from '@app/ui/components/containers/headers/dialog-header';

import { EditNonceForm } from './components/edit-nonce-form';

const url = 'https://leather.gitbook.io/guides/transactions/nonces';

export function EditNonceDialog() {
  const { errors, setFieldError, setFieldValue, validateField, values } = useFormikContext<
    StacksSendFormValues | StacksTransactionFormValues
  >();
  const [loadedNextNonce, setLoadedNextNonce] = useState<number | string>();

  const navigate = useNavigate();
  const { search } = useLocation();

  useOnMount(() => setLoadedNextNonce(values.nonce));
  const onGoBack = useCallback(() => {
    if (search) {
      return navigate('..' + search, { replace: true });
    }
    navigate(-1);
  }, [navigate, search]);

  const onBlur = useCallback(() => validateField('nonce'), [validateField]);

  const onSubmit = useCallback(async () => {
    await validateField('nonce');
    if (!errors.nonce) onGoBack();
  }, [errors.nonce, onGoBack, validateField]);

  const onClose = useCallback(async () => {
    if (!values.nonce) await setFieldValue('nonce', undefined);
    setFieldError('nonce', '');
    await setFieldValue('nonce', loadedNextNonce);
    onGoBack();
  }, [loadedNextNonce, onGoBack, setFieldError, setFieldValue, values.nonce]);

  return (
    <Dialog isShowing onClose={onClose} header={<DialogHeader title="Edit nonce" />}>
      <Stack gap="space.05" pb="space.06" px="space.05">
        <styled.span textStyle="caption.01">
          If your transaction has been pending for a long time, its nonce might not be correct.
          <Link fontSize="14px" ml="space.01" onClick={() => openInNewTab(url)}>
            Learn more.
          </Link>
        </styled.span>
        <EditNonceForm onBlur={onBlur} onClose={onClose} onSubmit={onSubmit} />
      </Stack>
    </Dialog>
  );
}
