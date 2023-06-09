import { useCallback } from 'react';

import StacksApp from '@zondax/ledger-stacks';

import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { requestPublicKeyForStxAccount } from '../utils/stacks-ledger-utils';
import { useLedgerNavigate } from './use-ledger-navigate';

export function useVerifyMatchingLedgerStacksPublicKey() {
  const account = useCurrentStacksAccount();
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
