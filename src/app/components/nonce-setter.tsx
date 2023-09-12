import { useEffect } from 'react';

import { useFormikContext } from 'formik';

import { StacksSendFormValues, StacksTransactionFormValues } from '@shared/models/form.model';

import { useNextNonce } from '@app/query/stacks/nonce/account-nonces.hooks';

export function NonceSetter() {
  const { setFieldValue, touched, values } = useFormikContext<
    StacksSendFormValues | StacksTransactionFormValues
  >();
  const { data: nextNonce } = useNextNonce();

  useEffect(() => {
    if (nextNonce && !touched.nonce && values.nonce !== nextNonce.nonce)
      setFieldValue('nonce', nextNonce.nonce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextNonce?.nonce]);

  return <></>;
}
