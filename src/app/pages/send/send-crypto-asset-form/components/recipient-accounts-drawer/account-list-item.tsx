import { memo } from 'react';

import { useFormikContext } from 'formik';

import { StacksSendFormValues } from '@shared/models/form.model';

import { useAccountDisplayName } from '@app/common/hooks/account/use-account-names';
import { AccountAvatarItem } from '@app/components/account/account-avatar';
import { AccountBalanceLabel } from '@app/components/account/account-balance-label';
import { AccountListItemLayout } from '@app/components/account/account-list-item-layout';
import { AccountName } from '@app/components/account/account-name';
import { usePressable } from '@app/components/item-hover';
import { WalletAccount } from '@app/store/accounts/account.models';

interface AccountListItemProps {
  account: WalletAccount;
  onClose(): void;
}
export const AccountListItem = memo(({ account, onClose }: AccountListItemProps) => {
  const { setFieldValue } = useFormikContext<StacksSendFormValues>();
  const [component, bind] = usePressable(true);
  const name = useAccountDisplayName(account);

  const onSelectAccount = () => {
    setFieldValue('recipient', account.address);
    setFieldValue('recipientAddressOrBnsName', account.address);
    onClose();
  };

  return (
    <AccountListItemLayout
      account={account}
      accountName={<AccountName account={account} />}
      avatar={
        <AccountAvatarItem index={account.index} publicKey={account.stxPublicKey} name={name} />
      }
      balanceLabel={<AccountBalanceLabel address={account.address} />}
      isActive={false}
      isLoading={false}
      mt="loose"
      onSelectAccount={onSelectAccount}
      {...bind}
    >
      {component}
    </AccountListItemLayout>
  );
});
