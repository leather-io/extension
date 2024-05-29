import { memo } from 'react';

import { AccountAvatarItem, AccountNameLayout, AccountTotalBalance } from '@leather-wallet/ui';
import { useFormikContext } from 'formik';

import { BitcoinSendFormValues, StacksSendFormValues } from '@shared/models/form.model';

import { useAccountDisplayName } from '@app/common/hooks/account/use-account-names';
import { useTotalBalance } from '@app/common/hooks/balance/use-total-balance';
import { AcccountAddresses } from '@app/components/account/account-addresses';
import { AccountListItemLayout } from '@app/components/account/account-list-item.layout';
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
  const stxAddress = stacksAccount?.address || '';
  const { data: name = '' } = useAccountDisplayName({ address: stxAddress, index });

  const bitcoinSigner = useNativeSegwitSigner(index);
  const btcAddress = bitcoinSigner?.(0).address || '';

  const { totalUsdBalance, isFetching, isInitialLoading } = useTotalBalance({
    btcAddress,
    stxAddress,
  });

  const onSelectAccount = () => {
    const isBitcoin = values.symbol === 'BTC';
    void setFieldValue('recipient', isBitcoin ? btcAddress : stxAddress, false);
    void setFieldTouched('recipient', false);
    onClose();
  };

  return (
    <AccountListItemLayout
      accountAddresses={<AcccountAddresses index={index} />}
      accountName={<AccountNameLayout>{name}</AccountNameLayout>}
      avatar={
        <AccountAvatarItem
          index={index}
          publicKey={stacksAccount?.stxPublicKey || ''}
          name={name}
        />
      }
      balanceLabel={
        <AccountTotalBalance
          totalUsdBalance={totalUsdBalance}
          isFetching={isFetching}
          isInitialLoading={isInitialLoading}
        />
      }
      index={index}
      isSelected={false}
      isLoading={false}
      onSelectAccount={onSelectAccount}
    />
  );
});
