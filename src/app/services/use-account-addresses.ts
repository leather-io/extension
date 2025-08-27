import { useMemo } from 'react';

import { createAccountAddresses } from '@leather.io/utils';

import { useBitcoinAccountXpubs } from '@app/store/accounts/blockchain/bitcoin/bitcoin.hooks';
import { useStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

export function useAccountAddresses(accountIndex: number) {
  const accountXpubs = useBitcoinAccountXpubs(accountIndex);
  const stxAccount = useStacksAccount(accountIndex);

  return useMemo(() => {
    return createAccountAddresses(
      { fingerprint: 'master', accountIndex },
      accountXpubs,
      stxAccount?.address
    );
  }, [accountXpubs, stxAccount, accountIndex]);
}
