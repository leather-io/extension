import { memo } from 'react';

import { useAccountDisplayName } from '@app/common/hooks/account/use-account-names';
import { useSwitchAccount } from '@app/common/hooks/account/use-switch-account';
import { useLoading } from '@app/common/hooks/use-loading';
import { AccountTotalBalance } from '@app/components/account-total-balance';
import { AccountListItemLayout } from '@app/components/account/account-list-item-layout';
import { usePressable } from '@app/components/item-hover';
import { useNativeSegwitSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useStacksAccounts } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { AccountAvatarItem } from '../../../components/account/account-avatar-item';
import { AccountNameLayout } from '../../../components/account/account-name';

interface SwitchAccountListItemProps {
  handleClose(): void;
  currentAccountIndex: number;
  index: number;
}
export const SwitchAccountListItem = memo(
  ({ handleClose, currentAccountIndex, index }: SwitchAccountListItemProps) => {
    const stacksAccounts = useStacksAccounts();
    const stacksAddress = stacksAccounts[index]?.address || '';
    const bitcoinSigner = useNativeSegwitSigner(index);
    const bitcoinAddress = bitcoinSigner?.(0).address || '';

    const { isLoading, setIsLoading, setIsIdle } = useLoading(
      'SWITCH_ACCOUNTS' + stacksAddress || bitcoinAddress
    );
    const { handleSwitchAccount } = useSwitchAccount(handleClose);
    const [component, bind] = usePressable(true);
    const name = useAccountDisplayName({ address: stacksAddress, index });

    const handleClick = async () => {
      setIsLoading();
      setTimeout(async () => {
        await handleSwitchAccount(index);
        setIsIdle();
      }, 80);
    };

    return (
      <AccountListItemLayout
        index={index}
        isLoading={isLoading}
        isActive={currentAccountIndex === index}
        avatar={
          <AccountAvatarItem
            index={index}
            publicKey={stacksAccounts[index]?.stxPublicKey || ''}
            name={name}
          />
        }
        onSelectAccount={handleClick}
        accountName={<AccountNameLayout>{name}</AccountNameLayout>}
        balanceLabel={
          <AccountTotalBalance stxAddress={stacksAddress} btcAddress={bitcoinAddress} />
        }
        mt="space.05"
        {...bind}
      >
        {component}
      </AccountListItemLayout>
    );
  }
);
