import { memo } from 'react';
import { useNavigate } from 'react-router-dom';

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
import { useNativeSegwitSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useStacksAccounts } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { AccountAvatarItem } from '../../../components/account/account-avatar';
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
    const navigate = useNavigate();

    const handleClick = async () => {
      setIsLoading();
      setTimeout(async () => {
        await handleSwitchAccount(index);
        setIsIdle();
      }, 80);
    };

    const analytics = useAnalytics();
    const { onCopy, hasCopied } = useClipboard(stacksAddress || '');
    const { setIsShowingSwitchAccountsState } = useDrawers();

    const onCopyToClipboard = (e: React.MouseEvent) => {
      e.stopPropagation();
      void analytics.track('copy_address_to_clipboard');
      onCopy();
    };

    const onClickBtcCopyIcon = (e: React.MouseEvent) => {
      if (!bitcoinAddress) return;
      e.stopPropagation();
      setIsShowingSwitchAccountsState(false);
      navigate(RouteUrls.ReceiveBtc, {
        state: { btcAddress: bitcoinAddress, accountIndex: currentAccountIndex },
      });
    };

    return (
      <AccountListItemLayout
        index={index}
        isLoading={isLoading}
        isActive={currentAccountIndex === index}
        avatar={
          <AccountAvatarItem
            index={currentAccountIndex}
            publicKey={stacksAccounts[currentAccountIndex]?.stxPublicKey || ''}
            name={name}
          />
        }
        onSelectAccount={handleClick}
        accountName={<AccountNameLayout>{name}</AccountNameLayout>}
        balanceLabel={
          <AccountTotalBalance stxAddress={stacksAddress} btcAddress={bitcoinAddress} />
        }
        hasCopied={hasCopied}
        onCopyToClipboard={onCopyToClipboard}
        onClickBtcCopyIcon={onClickBtcCopyIcon}
        mt="loose"
        {...bind}
      >
        {component}
      </AccountListItemLayout>
    );
  }
);
