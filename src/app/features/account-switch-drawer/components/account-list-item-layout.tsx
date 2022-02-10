import { truncateMiddle } from '@stacks/ui-utils';
import { Box, Stack, color, Spinner, StackProps } from '@stacks/ui';
import { FiCheck as IconCheck } from 'react-icons/fi';

import { SpaceBetween } from '@app/components/space-between';
import { SettingsSelectors } from '@tests/integration/settings.selectors';
import { SoftwareWalletAccountWithAddress } from '@app/store/accounts/account.models';
import { Caption } from '@app/components/typography';

interface AccountListItemLayoutProps extends StackProps {
  isLoading: boolean;
  isActive: boolean;
  account: SoftwareWalletAccountWithAddress;
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
    ...rest
  } = props;

  return (
    <SpaceBetween
      width="100%"
      key={`account-${account.index}`}
      data-testid={SettingsSelectors.AccountIndex.replace('[index]', `${account.index}`)}
      _hover={{ bg: color('bg-4') }}
      cursor="pointer"
      py="base"
      px="extra-loose"
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
        <Spinner position="absolute" right="loose" color={color('text-caption')} size="18px" />
      )}

      {isActive && (
        <Box
          as={IconCheck}
          size="18px"
          strokeWidth={2.5}
          color={color('brand')}
          data-testid={`account-checked-${account.index}`}
        />
      )}
    </SpaceBetween>
  );
}
