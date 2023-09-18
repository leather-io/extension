import { useEffect } from 'react';

import { useFormikContext } from 'formik';

import { logger } from '@shared/logger';
import { StacksSendFormValues, StacksTransactionFormValues } from '@shared/models/form.model';

import { useNextNonce } from '@app/query/stacks/nonce/account-nonces.hooks';

export function NonceSetter() {
  const { setFieldValue, touched, values } = useFormikContext<
    StacksSendFormValues | StacksTransactionFormValues
  >();
  const { data: nextNonce } = useNextNonce();

  useEffect(() => {
    const setAsyncFieldValue = async (nonce: number) => await setFieldValue('nonce', nonce);
    if (nextNonce?.nonce && !touched.nonce && values.nonce !== nextNonce.nonce)
      setAsyncFieldValue(nextNonce.nonce).catch(e => logger.error(e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextNonce?.nonce]);

  return <></>;
}
