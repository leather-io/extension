import { ReactNode, useEffect } from 'react';
import { useFormikContext } from 'formik';

import { useNextNonce } from '@app/query/stacks/nonce/account-nonces.hooks';
import { TransactionFormValues } from '@shared/models/form.model';

interface TxRequestFormNonceSetterProps {
  children: ReactNode;
}
export function TxRequestFormNonceSetter({ children }: TxRequestFormNonceSetterProps) {
  const { setFieldValue, touched, values } = useFormikContext<TransactionFormValues>();
  const { nonce } = useNextNonce();

  useEffect(() => {
    if (!touched.nonce && values.nonce !== nonce) setFieldValue('nonce', nonce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nonce]);

  return <>{children}</>;
}
