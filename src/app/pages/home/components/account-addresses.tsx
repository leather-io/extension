import { memo } from 'react';

import { Stack, StackProps } from '@stacks/ui';
import { truncateMiddle } from '@stacks/ui-utils';

import { useCurrentAccountNamesQuery } from '@app/query/stacks/bns/bns.hooks';
import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { useBtcNativeSegwitAccountIndexAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useBitcoinFeature } from '@app/store/feature-flags/feature-flags.slice';

import { AccountAddress } from './account-address';

export const AccountAddresses = memo((props: StackProps) => {
  const currentAccount = useCurrentAccount();
  const accountIndex = useCurrentAccountIndex();
  const btcAddress = useBtcNativeSegwitAccountIndexAddressIndexZero(accountIndex);
  const currentAccountNamesQuery = useCurrentAccountNamesQuery();
  const isBitcoinEnabled = useBitcoinFeature();
  const bnsName = currentAccountNamesQuery.data?.names[0];

  return currentAccount ? (
    <Stack isInline {...props}>
      <AccountAddress
        address={currentAccount.address}
        addressLabel={truncateMiddle(currentAccount.address, 4)}
        label="Copy Stacks address"
      />
      {isBitcoinEnabled ? (
        <AccountAddress
          address={btcAddress}
          addressLabel={truncateMiddle(btcAddress, 4)}
          label="Copy Bitcoin address"
        />
      ) : null}
      {bnsName ? (
        <AccountAddress address={bnsName} addressLabel={bnsName} label="Copy BNS address" />
      ) : null}
    </Stack>
  ) : null;
});
