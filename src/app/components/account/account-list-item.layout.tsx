import { ReactNode } from 'react';

import { ItemLayout, Pressable, Spinner } from '@leather-wallet/ui';
import { SettingsSelectors } from '@tests/selectors/settings.selectors';

interface AccountListItemLayoutProps {
  accountAddresses: ReactNode;
  accountName: ReactNode;
  avatar: ReactNode;
  balanceLabel: ReactNode;
  index: number;
  isLoading: boolean;
  isSelected: boolean;
  onSelectAccount(): void;
}
export function AccountListItemLayout(props: AccountListItemLayoutProps) {
  const {
    accountAddresses,
    accountName,
    avatar,
    balanceLabel,
    index,
    isLoading,
    isSelected,
    onSelectAccount,
  } = props;

  return (
    <Pressable
      data-testid={SettingsSelectors.SwitchAccountItemIndex.replace('[index]', `${index}`)}
      key={`account-${index}`}
      onClick={onSelectAccount}
    >
      <ItemLayout
        isSelected={isSelected}
        flagImg={avatar}
        titleLeft={accountName}
        titleRight={
          isLoading ? (
            <Spinner color="ink.text-subdued" position="absolute" right={0} top="calc(50% - 8px)" />
          ) : (
            balanceLabel
          )
        }
        captionLeft={accountAddresses}
      />
    </Pressable>
  );
}
