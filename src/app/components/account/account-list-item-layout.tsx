import { FiCopy } from 'react-icons/fi';

import {
  Box,
  Flex,
  Spinner,
  Stack,
  StackProps,
  Tooltip,
  color,
  useClipboard,
  useMediaQuery,
} from '@stacks/ui';
import { truncateMiddle } from '@stacks/ui-utils';
import { SettingsSelectors } from '@tests-legacy/integration/settings.selectors';
import { UserAreaSelectors } from '@tests-legacy/integration/user-area.selectors';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { Caption } from '@app/components/typography';
import { WalletAccount } from '@app/store/accounts/account.models';

import { AccountActiveCheckmark } from './account-active-checkmark';

interface AccountListItemLayoutProps extends StackProps {
  isLoading: boolean;
  isActive: boolean;
  account: WalletAccount;
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

  const [isNarrowViewport] = useMediaQuery('(max-width: 400px)');
  const analytics = useAnalytics();
  const { onCopy, hasCopied } = useClipboard(account.address || '');

  const copyToClipboard = (e: React.MouseEvent) => {
    e.stopPropagation();
    void analytics.track('copy_address_to_clipboard');
    onCopy();
  };
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
          <Flex>
            {accountName}
            {isActive && isNarrowViewport && (
              <AccountActiveCheckmark index={account.index} ml="tight" />
            )}
          </Flex>

          <Stack alignItems="center" spacing="6px" isInline whiteSpace="nowrap">
            <Caption>{truncateMiddle(account.address, isNarrowViewport ? 3 : 4)}</Caption>
            <Tooltip placement="right" label={hasCopied ? 'Copied!' : 'Copy address'}>
              <Stack>
                <Box
                  _hover={{ cursor: 'pointer' }}
                  onClick={copyToClipboard}
                  size="12px"
                  color={color('text-caption')}
                  data-testid={UserAreaSelectors.AccountCopyAddress}
                  as={FiCopy}
                />
              </Stack>
            </Tooltip>
            {balanceLabel}
          </Stack>
        </Stack>
      </Stack>
      {isLoading && (
        <Spinner
          position="absolute"
          right={0}
          top="calc(50% - 8px)"
          color={color('text-caption')}
          size="18px"
        />
      )}
      {isActive && !isNarrowViewport && (
        <AccountActiveCheckmark
          index={account.index}
          position="absolute"
          right={0}
          top="calc(50% - 8px)"
        />
      )}
      {children}
    </Flex>
  );
}
