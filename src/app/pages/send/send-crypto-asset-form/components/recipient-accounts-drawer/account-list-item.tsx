import { memo } from 'react';

import { useFormikContext } from 'formik';

import { BitcoinSendFormValues, StacksSendFormValues } from '@shared/models/form.model';

import { useAccountDisplayName } from '@app/common/hooks/account/use-account-names';
import { AccountTotalBalance } from '@app/components/account-total-balance';
import { AccountAvatarItem } from '@app/components/account/account-avatar';
import { AccountListItemLayout } from '@app/components/account/account-list-item-layout';
import { AccountName } from '@app/components/account/account-name';
import { usePressable } from '@app/components/item-hover';
import { useNativeSegwitAccountIndexAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { StacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.models';

interface AccountListItemProps {
  account: StacksAccount;
  onClose(): void;
}
export const AccountListItem = memo(({ account, onClose }: AccountListItemProps) => {
  const { setFieldValue, values, setFieldTouched } = useFormikContext<
    BitcoinSendFormValues | StacksSendFormValues
  >();
  const [component, bind] = usePressable(true);
  const name = useAccountDisplayName(account);

  const btcAddress = useNativeSegwitAccountIndexAddressIndexZero(account.index);

  const onSelectAccount = () => {
    const isBitcoin = values.symbol === 'BTC';
    void setFieldValue('recipient', isBitcoin ? btcAddress : account.address, false);
    setFieldTouched('recipient', false);
    onClose();
  };

  return (
    <AccountListItemLayout
      accountName={<AccountName account={account} />}
      avatar={
        <AccountAvatarItem index={account.index} publicKey={account.stxPublicKey} name={name} />
      }
      balanceLabel={<AccountTotalBalance stxAddress={account.address} btcAddress={btcAddress} />}
      btcAddress={btcAddress}
      index={account.index}
      isActive={false}
      isLoading={false}
      mt="space.05"
      onSelectAccount={onSelectAccount}
      stxAddress={account.address}
      {...bind}
    >
      {component}
    </AccountListItemLayout>
  );
});
