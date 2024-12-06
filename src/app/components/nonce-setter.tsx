import { useAsync } from 'react-async-hook';

import { useFormikContext } from 'formik';

import { useNextNonce } from '@leather.io/query';

import { StacksSendFormValues, StacksTransactionFormValues } from '@shared/models/form.model';

import type { SwapFormValues } from '@app/pages/swap/hooks/use-swap-form';
import { useCurrentStacksAccountAddress } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

export function NonceSetter() {
  const { setFieldValue, touched, values } = useFormikContext<
    StacksSendFormValues | StacksTransactionFormValues | SwapFormValues
  >();
  const stxAddress = useCurrentStacksAccountAddress();
  const { data: nextNonce } = useNextNonce(stxAddress);

  useAsync(async () => {
    if (nextNonce?.nonce && !touched.nonce && values.nonce !== nextNonce.nonce) {
      return await setFieldValue('nonce', nextNonce?.nonce);
    }
    return;
  }, [nextNonce?.nonce]);

  return <></>;
}
