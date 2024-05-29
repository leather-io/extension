import { memo } from 'react';

import { AccountAvatarItem, AccountNameLayout, AccountTotalBalance } from '@leather-wallet/ui';

import { useAccountDisplayName } from '@app/common/hooks/account/use-account-names';
import { useSwitchAccount } from '@app/common/hooks/account/use-switch-account';
import { useTotalBalance } from '@app/common/hooks/balance/use-total-balance';
import { useLoading } from '@app/common/hooks/use-loading';
import { AcccountAddresses } from '@app/components/account/account-addresses';
import { AccountListItemLayout } from '@app/components/account/account-list-item.layout';
import { useNativeSegwitSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useStacksAccounts } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

interface SwitchAccountListItemProps {
  handleClose(): void;
  currentAccountIndex: number;
  index: number;
}
export const SwitchAccountListItem = memo(
  ({ handleClose, currentAccountIndex, index }: SwitchAccountListItemProps) => {
    const stacksAccounts = useStacksAccounts();
    const stxAddress = stacksAccounts[index]?.address || '';
    const bitcoinSigner = useNativeSegwitSigner(index);
    const btcAddress = bitcoinSigner?.(0).address || '';

    const { isLoading, setIsLoading, setIsIdle } = useLoading(
      'SWITCH_ACCOUNTS' + stxAddress || btcAddress
    );
    const { handleSwitchAccount } = useSwitchAccount(handleClose);
    const { data: name = '', isFetching: isFetchingBnsName } = useAccountDisplayName({
      address: stxAddress,
      index,
    });
    const { totalUsdBalance, isFetching, isInitialLoading } = useTotalBalance({
      btcAddress,
      stxAddress,
    });

    const handleClick = async () => {
      setIsLoading();
      setTimeout(async () => {
        await handleSwitchAccount(index);
        setIsIdle();
      }, 80);
    };

    return (
      <AccountListItemLayout
        accountAddresses={<AcccountAddresses index={index} />}
        accountName={<AccountNameLayout isLoading={isFetchingBnsName}>{name}</AccountNameLayout>}
        avatar={
          <AccountAvatarItem
            index={index}
            publicKey={stacksAccounts[index]?.stxPublicKey || ''}
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
        isLoading={isLoading}
        isSelected={currentAccountIndex === index}
        onSelectAccount={handleClick}
      />
    );
  }
);
