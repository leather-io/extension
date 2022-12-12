import { ReactNode, useEffect } from 'react';

import { useFormikContext } from 'formik';

import { SendFormValues, TransactionFormValues } from '@shared/models/form.model';

import { useNextNonce } from '@app/query/stacks/nonce/account-nonces.hooks';

interface NonceSetterProps {
  children: ReactNode;
}
export function NonceSetter({ children }: NonceSetterProps) {
  const { setFieldValue, touched, values } = useFormikContext<
    SendFormValues | TransactionFormValues
  >();
  const { data: nextNonce } = useNextNonce();

  useEffect(() => {
    if (nextNonce && !touched.nonce && values.nonce !== nextNonce.nonce)
      setFieldValue('nonce', nextNonce.nonce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextNonce?.nonce]);

  return <>{children}</>;
}
