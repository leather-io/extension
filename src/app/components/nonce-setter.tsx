import { useAsync } from 'react-async-hook';

import { useFormikContext } from 'formik';

import { useNextNonce } from '@leather.io/query';
import { isDefined } from '@leather.io/utils';

import {
  StacksSendFormValues,
  StacksTransactionFormValues,
  type SwapFormValues,
} from '@shared/models/form.model';

import { useCurrentStacksAccountAddress } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

export function NonceSetter() {
  const { setFieldValue, touched, values } = useFormikContext<
    StacksSendFormValues | StacksTransactionFormValues | SwapFormValues
  >();
  const stxAddress = useCurrentStacksAccountAddress();
  const { data: nextNonce } = useNextNonce(stxAddress);

  useAsync(async () => {
    if (isDefined(nextNonce?.nonce) && !touched.nonce && values.nonce !== nextNonce?.nonce) {
      return await setFieldValue('nonce', nextNonce?.nonce);
    }
    return;
  }, [nextNonce?.nonce]);

  return <></>;
}
