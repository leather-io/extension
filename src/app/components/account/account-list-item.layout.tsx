import { ReactNode } from 'react';

import { SettingsSelectors } from '@tests/selectors/settings.selectors';

import { ChevronRightIcon, Flag, ItemLayout, Pressable, Spinner } from '@leather.io/ui';

import { useWindowMinWidth } from '@app/common/hooks/use-media-query';

interface AccountListItemLayoutProps {
  accountAddresses: ReactNode;
  accountName: ReactNode;
  avatar: ReactNode;
  balanceLabel: ReactNode;
  withChevron?: boolean;
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
    withChevron,
    onSelectAccount,
  } = props;

  const isGreaterThanTinyWidth = useWindowMinWidth(320);

  const content = (
    <ItemLayout
      isSelected={isSelected}
      img={isGreaterThanTinyWidth ? avatar : null}
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
  );

  return (
    <Pressable
      data-testid={SettingsSelectors.SwitchAccountItemIndex.replace('[index]', `${index}`)}
      key={`account-${index}`}
      onClick={onSelectAccount}
    >
      {withChevron ? (
        <Flag reverse img={<ChevronRightIcon variant="small" />}>
          {content}
        </Flag>
      ) : (
        content
      )}
    </Pressable>
  );
}
