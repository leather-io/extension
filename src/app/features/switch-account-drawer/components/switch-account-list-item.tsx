import { memo } from 'react';
import { useNavigate } from 'react-router-dom';

// #4164 FIXME migrate useClipboard
import { useClipboard } from '@stacks/ui';

import { RouteUrls } from '@shared/route-urls';

import { useAccountDisplayName } from '@app/common/hooks/account/use-account-names';
import { useSwitchAccount } from '@app/common/hooks/account/use-switch-account';
import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useDrawers } from '@app/common/hooks/use-drawers';
import { useLoading } from '@app/common/hooks/use-loading';
import { AccountTotalBalance } from '@app/components/account-total-balance';
import { AccountListItemLayout } from '@app/components/account/account-list-item-layout';
import { usePressable } from '@app/components/item-hover';
import { useNativeSegwitAccountIndexAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
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
    const navigate = useNavigate();

    const btcAddress = useNativeSegwitAccountIndexAddressIndexZero(account.index);

    const handleClick = async () => {
      setIsLoading();
      setTimeout(async () => {
        await handleSwitchAccount(account.index);
        setIsIdle();
      }, 80);
    };

    const analytics = useAnalytics();
    const { onCopy, hasCopied } = useClipboard(account.address || '');
    const { setIsShowingSwitchAccountsState } = useDrawers();

    const onCopyToClipboard = (e: React.MouseEvent) => {
      e.stopPropagation();
      void analytics.track('copy_address_to_clipboard');
      onCopy();
    };

    const onClickBtcCopyIcon = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsShowingSwitchAccountsState(false);
      navigate(RouteUrls.ReceiveBtc, { state: { btcAddress, accountIndex: account.index } });
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
        balanceLabel={<AccountTotalBalance stxAddress={account.address} btcAddress={btcAddress} />}
        hasCopied={hasCopied}
        onCopyToClipboard={onCopyToClipboard}
        onClickBtcCopyIcon={onClickBtcCopyIcon}
        mt="space.05"
        {...bind}
      >
        {component}
      </AccountListItemLayout>
    );
  }
);
