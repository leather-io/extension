import { memo } from 'react';

import { useFormikContext } from 'formik';

import { SendFormValues } from '@shared/models/form.model';

import { useAccountDisplayName } from '@app/common/hooks/account/use-account-names';
import {
  AccountBalanceCaption,
  AccountBalanceLoading,
} from '@app/components/account/account-balance-caption';
import { AccountListItemLayout } from '@app/components/account/account-list-item-layout';
import { usePressable } from '@app/components/item-hover';
import { AccountAvatarItem } from '@app/features/switch-account-drawer/components/account-avatar';
import { AccountName } from '@app/features/switch-account-drawer/components/account-name';
import { useStxMarketData } from '@app/query/common/market-data/market-data.hooks';
import { useAccountUnanchoredBalances } from '@app/query/stacks/balance/balance.hooks';
import { AccountWithAddress } from '@app/store/accounts/account.models';

interface AccountBalanceLabelProps {
  address: string;
}
const AccountBalanceLabel = memo(({ address }: AccountBalanceLabelProps) => {
  const stxMarketData = useStxMarketData();
  const { data: balances, isLoading } = useAccountUnanchoredBalances(address);

  if (isLoading) return <AccountBalanceLoading />;

  if (!balances) return null;

  return (
    <AccountBalanceCaption
      availableBalance={balances.stx.availableStx}
      marketData={stxMarketData}
    />
  );
});

interface SwitchAccountListItemProps {
  account: AccountWithAddress;
  handleClose(): void;
}
export const RecipientAccountListItem = memo(
  ({ account, handleClose }: SwitchAccountListItemProps) => {
    const [component, bind] = usePressable(true);
    const name = useAccountDisplayName(account);
    const { setFieldValue } = useFormikContext<SendFormValues>();

    const handleClick = () => {
      setFieldValue('recipientAddressOrBnsName', account.address);
      setFieldValue('recipient', account.address);
      handleClose();
    };

    return (
      <AccountListItemLayout
        account={account}
        isLoading={false}
        isActive={false}
        avatar={
          <AccountAvatarItem index={account.index} publicKey={account.stxPublicKey} name={name} />
        }
        onSelectAccount={handleClick}
        accountName={<AccountName account={account} />}
        balanceLabel={<AccountBalanceLabel address={account.address} />}
        mt="loose"
        {...bind}
      >
        {component}
      </AccountListItemLayout>
    );
  }
);
