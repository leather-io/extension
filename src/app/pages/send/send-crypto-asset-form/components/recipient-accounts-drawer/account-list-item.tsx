import { memo } from 'react';

import { useFormikContext } from 'formik';

import { BitcoinSendFormValues, StacksSendFormValues } from '@shared/models/form.model';

import { useAccountDisplayName } from '@app/common/hooks/account/use-account-names';
import { AccountTotalBalance } from '@app/components/account-total-balance';
import { AccountAvatarItem } from '@app/components/account/account-avatar-item';
import { AccountListItemLayout } from '@app/components/account/account-list-item-layout';
import { AccountNameLayout } from '@app/components/account/account-name';
import { usePressable } from '@app/components/item-hover';
import { useNativeSegwitSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { StacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.models';

interface AccountListItemProps {
  stacksAccount: StacksAccount;
  index: number;
  onClose(): void;
}
export const AccountListItem = memo(({ index, stacksAccount, onClose }: AccountListItemProps) => {
  const { setFieldValue, values, setFieldTouched } = useFormikContext<
    BitcoinSendFormValues | StacksSendFormValues
  >();
  const [component, bind] = usePressable(true);
  const stacksAddress = stacksAccount?.address || '';
  const name = useAccountDisplayName({ address: stacksAddress, index });

  const bitcoinSigner = useNativeSegwitSigner(index);
  const bitcoinAddress = bitcoinSigner?.(0).address || '';

  const onSelectAccount = () => {
    const isBitcoin = values.symbol === 'BTC';
    void setFieldValue('recipient', isBitcoin ? bitcoinAddress : stacksAddress, false);
    void setFieldTouched('recipient', false);
    onClose();
  };

  return (
    <AccountListItemLayout
      accountName={<AccountNameLayout>{name}</AccountNameLayout>}
      avatar={
        <AccountAvatarItem
          index={index}
          publicKey={stacksAccount?.stxPublicKey || ''}
          name={name}
        />
      }
      balanceLabel={<AccountTotalBalance stxAddress={stacksAddress} btcAddress={bitcoinAddress} />}
      index={index}
      isActive={false}
      isLoading={false}
      mt="space.05"
      onSelectAccount={onSelectAccount}
      {...bind}
    >
      {component}
    </AccountListItemLayout>
  );
});
