import { useMemo } from 'react';

import { createAccountAddresses } from '@leather.io/utils';

import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { useCurrentBitcoinAccountXpubs } from '@app/store/accounts/blockchain/bitcoin/bitcoin.hooks';
import { useCurrentStacksAccountAddress } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

export function useAccountAddresses() {
  const accountXpubs = useCurrentBitcoinAccountXpubs();
  const stxAddress = useCurrentStacksAccountAddress();
  const accountIndex = useCurrentAccountIndex();

  return useMemo(() => {
    return createAccountAddresses(
      { fingerprint: 'master', accountIndex },
      accountXpubs,
      stxAddress
    );
  }, [accountXpubs, stxAddress, accountIndex]);
}
