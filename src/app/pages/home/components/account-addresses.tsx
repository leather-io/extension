import { memo } from 'react';

import { Stack, StackProps } from '@stacks/ui';

import { useConfigBitcoinEnabled } from '@app/query/common/hiro-config/hiro-config.query';
import { useCurrentAccountNamesQuery } from '@app/query/stacks/bns/bns.hooks';
import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { useBtcNativeSegwitAccountIndexAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { AccountAddress } from './account-address';

export const AccountAddresses = memo((props: StackProps) => {
  const currentAccount = useCurrentAccount();
  const accountIndex = useCurrentAccountIndex();
  const btcAddress = useBtcNativeSegwitAccountIndexAddressIndexZero(accountIndex);
  const currentAccountNamesQuery = useCurrentAccountNamesQuery();
  const isBitcoinEnabled = useConfigBitcoinEnabled();
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
