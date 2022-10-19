import { truncateMiddle } from '@stacks/ui-utils';
import { Box, Stack, color, Spinner, StackProps, Flex } from '@stacks/ui';
import { FiCheck as IconCheck } from 'react-icons/fi';

import { SettingsSelectors } from '@tests/integration/settings.selectors';
import { AccountWithAddress } from '@app/store/accounts/account.models';
import { Caption } from '@app/components/typography';

interface AccountListItemLayoutProps extends StackProps {
  isLoading: boolean;
  isActive: boolean;
  account: AccountWithAddress;
  accountName: JSX.Element;
  avatar: JSX.Element;
  balanceLabel: JSX.Element;
  onSelectAccount(): void;
}
export function AccountListItemLayout(props: AccountListItemLayoutProps) {
  const {
    account,
    isLoading,
    isActive,
    accountName,
    avatar,
    balanceLabel,
    onSelectAccount,
    children = null,
    ...rest
  } = props;

  return (
    <Flex
      width="100%"
      key={`account-${account.index}`}
      data-testid={SettingsSelectors.AccountIndex.replace('[index]', `${account.index}`)}
      cursor="pointer"
      position="relative"
      onClick={onSelectAccount}
      {...rest}
    >
      <Stack isInline alignItems="center" spacing="base">
        {avatar}
        <Stack spacing="base-tight">
          {accountName}
          <Stack alignItems="center" spacing="6px" isInline>
            <Caption>{truncateMiddle(account.address, 4)}</Caption>
            {balanceLabel}
          </Stack>
        </Stack>
      </Stack>
      {isLoading && (
        <Spinner
          position="absolute"
          right="12px"
          top="calc(50% - 8px)"
          color={color('text-caption')}
          size="18px"
        />
      )}
      {isActive && (
        <Box
          position="absolute"
          right="12px"
          top="calc(50% - 8px)"
          as={IconCheck}
          size="18px"
          strokeWidth={2.5}
          color={color('brand')}
          data-testid={`account-checked-${account.index}`}
        />
      )}
      {children}
    </Flex>
  );
}
