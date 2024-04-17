import { memo, useCallback } from 'react';

import { useAccountDisplayName } from '@app/common/hooks/account/use-account-names';
import { useSwitchAccount } from '@app/common/hooks/account/use-switch-account';
import { useLoading } from '@app/common/hooks/use-loading';
import { AccountTotalBalance } from '@app/components/account-total-balance';
import { AcccountAddresses } from '@app/components/account/account-addresses';
import { AccountListItemLayout } from '@app/components/account/account-list-item.layout';
import { AccountNameLayout } from '@app/components/account/account-name';
import { useNativeSegwitSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { type StacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.models';
import { AccountAvatarItem } from '@app/ui/components/account/account-avatar/account-avatar-item';

interface SwitchAccountListItemProps {
  handleClose(): void;
  currentAccountIndex: number;
  index: number;
  stxAccount: StacksAccount;
}
export const SwitchAccountListItem = memo(
  ({ handleClose, currentAccountIndex, index, stxAccount }: SwitchAccountListItemProps) => {
    const bitcoinSigner = useNativeSegwitSigner(index);
    const btcAddress = bitcoinSigner?.(0).address || '';

    const { address: stxAddress, stxPublicKey } = stxAccount;

    const { isLoading, setIsLoading, setIsIdle } = useLoading(
      'SWITCH_ACCOUNTS' + stxAddress || btcAddress
    );
    const { handleSwitchAccount } = useSwitchAccount(handleClose);
    const { name, isLoading: isLoadingBnsName } = useAccountDisplayName({
      address: stxAccount?.address,
      index,
    });

    const handleClick = useCallback(async () => {
      setIsLoading();
      setTimeout(async () => {
        await handleSwitchAccount(index);
        setIsIdle();
      }, 80);
    }, [index, handleSwitchAccount, setIsIdle, setIsLoading]);
    // console.log('render index', index);
    return (
      <AccountListItemLayout
        accountAddresses={<AcccountAddresses index={index} />}
        accountName={<AccountNameLayout isLoading={isLoadingBnsName}>{name}</AccountNameLayout>}
        avatar={<AccountAvatarItem index={index} publicKey={stxPublicKey || ''} name={name} />}
        balanceLabel={<AccountTotalBalance stxAddress={stxAddress} btcAddress={btcAddress} />}
        index={index}
        isLoading={isLoading}
        isSelected={currentAccountIndex === index}
        onSelectAccount={handleClick}
      />
    );
  }
);
