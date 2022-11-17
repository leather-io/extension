import { memo } from 'react';

import { useFormikContext } from 'formik';

import { SendFormValues } from '@shared/models/form.model';

import { useAccountDisplayName } from '@app/common/hooks/account/use-account-names';
import { AccountListItemLayout } from '@app/components/account/account-list-item-layout';
import { usePressable } from '@app/components/item-hover';
import { AccountAvatarItem } from '@app/features/switch-account-drawer/components/account-avatar';
import { AccountName } from '@app/features/switch-account-drawer/components/account-name';
import { AccountWithAddress } from '@app/store/accounts/account.models';
import { AccountBalanceLabel } from '@app/components/account/account-balance-label';


interface RecipientAccountListItemProps {
  account: AccountWithAddress;
  handleClose(): void;
}
export const RecipientAccountListItem = memo(
  ({ account, handleClose }: RecipientAccountListItemProps) => {
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
