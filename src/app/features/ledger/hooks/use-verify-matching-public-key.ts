import { useCallback } from 'react';

import StacksApp from '@zondax/ledger-stacks';

import { useCurrentAccount } from '@app/store/accounts/account.hooks';

import { requestPublicKeyForStxAccount } from '../ledger-utils';
import { useLedgerNavigate } from './use-ledger-navigate';

export function useVerifyMatchingLedgerPublicKey() {
  const account = useCurrentAccount();
  const ledgerNavigate = useLedgerNavigate();

  return useCallback(
    async (stacksApp: StacksApp) => {
      if (!account) return;
      const { publicKey } = await requestPublicKeyForStxAccount(stacksApp)(account.index);
      if (publicKey.toString('hex') !== account.stxPublicKey) {
        ledgerNavigate.toPublicKeyMismatchStep();
        throw new Error('Mismatching public keys');
      }
    },
    [account, ledgerNavigate]
  );
}
