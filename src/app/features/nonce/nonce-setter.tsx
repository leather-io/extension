import { useAsync } from 'react-async-hook';

import { useFormikContext } from 'formik';

import { StacksSendFormValues, StacksTransactionFormValues } from '@shared/models/form.model';

import { usePersistedNonce } from './use-persisted-nonce';

export function NonceSetter() {
  const { setFieldValue, touched, values } = useFormikContext<
    StacksSendFormValues | StacksTransactionFormValues
  >();
  const { persistedNonce } = usePersistedNonce();

  useAsync(async () => {
    if (persistedNonce && !touched.nonce && values.nonce !== persistedNonce) {
      return await setFieldValue('nonce', persistedNonce);
    }
    return;
  }, [persistedNonce]);

  return <></>;
}
