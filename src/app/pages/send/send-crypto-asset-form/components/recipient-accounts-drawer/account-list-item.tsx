import { memo } from 'react';

import { useFormikContext } from 'formik';

import { BitcoinSendFormValues, StacksSendFormValues } from '@shared/models/form.model';

import { useAccountDisplayName } from '@app/common/hooks/account/use-account-names';
import { AccountAvatarItem } from '@app/components/account/account-avatar';
import { AccountBalanceLabel } from '@app/components/account/account-balance-label';
import { AccountListItemLayout } from '@app/components/account/account-list-item-layout';
import { AccountName } from '@app/components/account/account-name';
import { usePressable } from '@app/components/item-hover';
import { useBtcNativeSegwitAccountIndexAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { StacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.models';

interface AccountListItemProps {
  account: StacksAccount;
  onClose(): void;
}
export const AccountListItem = memo(({ account, onClose }: AccountListItemProps) => {
  const { setFieldValue, values } = useFormikContext<
    BitcoinSendFormValues | StacksSendFormValues
  >();
  const [component, bind] = usePressable(true);
  const name = useAccountDisplayName(account);

  const btcAddress = useBtcNativeSegwitAccountIndexAddressIndexZero(account.index);

  const onSelectAccount = () => {
    const isBitcoin = values.symbol === 'BTC';
    setFieldValue('recipient', isBitcoin ? btcAddress : account.address);
    setFieldValue('recipientAddressOrBnsName', isBitcoin ? btcAddress : account.address);
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
      btcAddress={btcAddress}
      index={account.index}
      isActive={false}
      isLoading={false}
      mt="loose"
      onSelectAccount={onSelectAccount}
      stxAddress={account.address}
      {...bind}
    >
      {component}
    </AccountListItemLayout>
  );
});
