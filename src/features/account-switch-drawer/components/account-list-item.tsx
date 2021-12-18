import { Suspense, memo } from 'react';

import { useSwitchAccount } from '@common/hooks/account/use-switch-account';
import { useLoading } from '@common/hooks/use-loading';
import { AccountBalanceCaption } from '@components/account-balance-caption';
import { Caption } from '@components/typography';
import { AccountName, AccountNameFallback } from './account-name';
import { useAddressAvailableStxBalance } from '@query/balance/balance.hooks';
import { AccountWithAddress } from '@store/accounts/account.models';
import { AccountListItemLayout } from './account-list-item-layout';
import { AccountAvatarItem } from './account-avatar';

interface AccountBalanceLabelProps {
  address: string;
}
const AccountBalanceLabel = memo(({ address }: AccountBalanceLabelProps) => {
  const availableStxBalance = useAddressAvailableStxBalance(address);
  return <AccountBalanceCaption availableBalance={availableStxBalance} />;
});

interface AccountListItemProps {
  account: AccountWithAddress;
  handleClose(): void;
}
export const AccountListItem = memo(({ account, handleClose }: AccountListItemProps) => {
  const { isLoading, setIsLoading, setIsIdle } = useLoading('SWITCH_ACCOUNTS' + account.address);
  const { handleSwitchAccount, getIsActive } = useSwitchAccount(handleClose);

  const handleClick = async () => {
    setIsLoading();
    setTimeout(async () => {
      await handleSwitchAccount(account.index);
      setIsIdle();
    }, 80);
  };

  return (
    <AccountListItemLayout
      account={account}
      isLoading={isLoading}
      isActive={getIsActive(account.index)}
      avatar={<AccountAvatarItem account={account} />}
      onSelectAccount={handleClick}
      accountName={
        <Suspense fallback={<AccountNameFallback account={account} />}>
          <AccountName account={account} />
        </Suspense>
      }
      balanceLabel={
        <Suspense fallback={<Caption>Loading…</Caption>}>
          <AccountBalanceLabel address={account.address} />
        </Suspense>
      }
    />
  );
});
