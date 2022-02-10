import { Suspense, memo } from 'react';

import { useSwitchAccount } from '@app/common/hooks/account/use-switch-account';
import { useLoading } from '@app/common/hooks/use-loading';
import { AccountBalanceCaption } from '@app/components/account-balance-caption';
import { Caption } from '@app/components/typography';
import { AccountName, AccountNameFallback } from './account-name';
import { useAddressBalances } from '@app/query/balance/balance.hooks';
import { AccountListItemLayout } from './account-list-item-layout';
import { AccountAvatarItem } from './account-avatar';
import { SoftwareWalletAccountWithAddress } from '@app/store/accounts/account.models';

interface AccountBalanceLabelProps {
  address: string;
}
const AccountBalanceLabel = memo(({ address }: AccountBalanceLabelProps) => {
  const { data: balances } = useAddressBalances(address);
  return <AccountBalanceCaption availableBalance={balances?.availableStx} />;
});

interface AccountListItemProps {
  account: SoftwareWalletAccountWithAddress;
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
      avatar={<AccountAvatarItem publicKey={account.stxPublicKey} index={account.index} />}
      onSelectAccount={handleClick}
      accountName={
        <Suspense fallback={<AccountNameFallback account={account} />}>
          <AccountName address={account.address} index={account.index} />
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
