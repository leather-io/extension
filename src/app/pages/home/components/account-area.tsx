import { color, Box, Stack, StackProps, useClipboard } from '@stacks/ui';
import { Caption } from '@app/components/typography';
import { memo } from 'react';
import { useCurrentAccount } from '@app/store/accounts/account.hooks';
import { Tooltip } from '@app/components/tooltip';
import { truncateMiddle } from '@stacks/ui-utils';
import { FiCopy } from 'react-icons/fi';
import { CurrentAccountAvatar } from '@app/features/current-account/current-account-avatar';
import { CurrentAccountName } from '@app/features/current-account/current-account-name';
import { UserAreaSelectors } from '@tests/integration/user-area.selectors';
import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';

const AccountAddress = memo((props: StackProps) => {
  const currentAccount = useCurrentAccount();
  const { onCopy, hasCopied } = useClipboard(currentAccount?.address || '');
  const analytics = useAnalytics();
  const copyToClipboard = () => {
    void analytics.track('copy_address_to_clipboard');
    onCopy();
  };

  return currentAccount ? (
    <Stack isInline {...props}>
      <Caption>{truncateMiddle(currentAccount.address, 4)}</Caption>
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
    </Stack>
  ) : null;
});

export const CurrentAccount = memo((props: StackProps) => {
  return (
    <Stack spacing="base-tight" alignItems="center" isInline {...props}>
      <CurrentAccountAvatar />
      <Stack overflow="hidden" display="block" alignItems="flex-start" spacing="base-tight">
        <CurrentAccountName />
        <AccountAddress />
      </Stack>
    </Stack>
  );
});
