import { memo } from 'react';

import { useClipboard } from '@stacks/ui';

import { useAccountDisplayName } from '@app/common/hooks/account/use-account-names';
import { useSwitchAccount } from '@app/common/hooks/account/use-switch-account';
import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useLoading } from '@app/common/hooks/use-loading';
import { AccountBalanceLabel } from '@app/components/account/account-balance-label';
import { AccountListItemLayout } from '@app/components/account/account-list-item-layout';
import { usePressable } from '@app/components/item-hover';
import { useBtcNativeSegwitAccountIndexAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { StacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.models';

import { AccountAvatarItem } from '../../../components/account/account-avatar';
import { AccountName } from '../../../components/account/account-name';

interface SwitchAccountListItemProps {
  account: StacksAccount;
  handleClose(): void;
}
export const SwitchAccountListItem = memo(
  ({ account, handleClose }: SwitchAccountListItemProps) => {
    const { isLoading, setIsLoading, setIsIdle } = useLoading('SWITCH_ACCOUNTS' + account.address);
    const { handleSwitchAccount, getIsActive } = useSwitchAccount(handleClose);
    const [component, bind] = usePressable(true);
    const name = useAccountDisplayName(account);

    const btcAddress = useBtcNativeSegwitAccountIndexAddressIndexZero(account.index);

    const handleClick = async () => {
      setIsLoading();
      setTimeout(async () => {
        await handleSwitchAccount(account.index);
        setIsIdle();
      }, 80);
    };

    const analytics = useAnalytics();
    const { onCopy, hasCopied } = useClipboard(account.address || '');
    const { onCopy: onCopyBtc, hasCopied: hasCopiedBtc } = useClipboard(btcAddress || '');

    const copyToClipboard = (e: React.MouseEvent) => {
      e.stopPropagation();
      void analytics.track('copy_address_to_clipboard');
      onCopy();
    };

    const copyBtcToClipboard = (e: React.MouseEvent) => {
      e.stopPropagation();
      void analytics.track('copy_btc_address_to_clipboard');
      onCopyBtc();
    };

    return (
      <AccountListItemLayout
        index={account.index}
        stxAddress={account.address}
        btcAddress={btcAddress}
        isLoading={isLoading}
        isActive={getIsActive(account.index)}
        avatar={
          <AccountAvatarItem index={account.index} publicKey={account.stxPublicKey} name={name} />
        }
        onSelectAccount={handleClick}
        accountName={<AccountName account={account} />}
        balanceLabel={<AccountBalanceLabel address={account.address} />}
        hasCopied={hasCopied}
        hasCopiedBtc={hasCopiedBtc}
        copyToClipboard={copyToClipboard}
        copyBtcToClipboard={copyBtcToClipboard}
        mt="loose"
        {...bind}
      >
        {component}
      </AccountListItemLayout>
    );
  }
);
