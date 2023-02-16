import { memo } from 'react';

import { Stack, StackProps } from '@stacks/ui';

import { useCurrentAccountNamesQuery } from '@app/query/stacks/bns/bns.hooks';
import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { useBtcAccountIndexAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/bitcoin-account.hooks';
import { useCurrentAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useBitcoinFeature } from '@app/store/feature-flags/feature-flags.slice';

import { AccountAddress } from './account-address';

export const AccountAddresses = memo((props: StackProps) => {
  const currentAccount = useCurrentAccount();
  const accountIndex = useCurrentAccountIndex();
  const btcAddress = useBtcAccountIndexAddressIndexZero(accountIndex);
  const currentAccountNamesQuery = useCurrentAccountNamesQuery();
  const isBitcoinEnabled = useBitcoinFeature();
  const bnsName = currentAccountNamesQuery.data?.names[0];

  return currentAccount ? (
    <Stack isInline {...props}>
      <AccountAddress address={currentAccount.address} label="Copy Stacks addres" />
      {isBitcoinEnabled ? (
        <AccountAddress address={btcAddress} label="Copy Bitcoin address" />
      ) : null}
      {bnsName ? <AccountAddress address={bnsName} label="Copy BNS addres" /> : null}
    </Stack>
  ) : null;
});
