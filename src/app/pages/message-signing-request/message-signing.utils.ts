import { useCallback } from 'react';

import { ClarityValue, TupleCV, createStacksPrivateKey } from '@stacks/transactions';

import { signMessage, signStructuredDataMessage } from '@shared/crypto/sign-message';
import { isString } from '@shared/utils';

import { useCurrentAccount } from '@app/store/accounts/account.hooks';

export function useMessageSignerSoftwareWallet() {
  const account = useCurrentAccount();
  return useCallback(
    ({ message, domain }: { message: string | ClarityValue; domain?: TupleCV }) => {
      if (!account || account.type === 'ledger') return null;
      const privateKey = createStacksPrivateKey(account.stxPrivateKey);
      if (isString(message)) {
        return signMessage(message, privateKey);
      } else {
        if (!domain) throw new Error('Domain is required for structured messages');
        // returns signature in RSV format
        return signStructuredDataMessage(message, domain, privateKey);
      }
    },
    [account]
  );
}
