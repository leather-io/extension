import { useAsync } from 'react-async-hook';

import { useFormikContext } from 'formik';

import { StacksSendFormValues, StacksTransactionFormValues } from '@shared/models/form.model';

import { useNextNonce } from '@app/query/stacks/nonce/account-nonces.hooks';

export function NonceSetter() {
  const { setFieldValue, touched, values } = useFormikContext<
    StacksSendFormValues | StacksTransactionFormValues
  >();
  const { data: nextNonce } = useNextNonce();

  useAsync(async () => {
    if (nextNonce?.nonce && !touched.nonce && values.nonce !== nextNonce.nonce) {
      return await setFieldValue('nonce', nextNonce?.nonce);
    }
    return;
  }, [nextNonce?.nonce]);

  return <></>;
}
