import { memo } from 'react';
import { FiCopy } from 'react-icons/fi';

import { Box, Stack, StackProps, color, useClipboard } from '@stacks/ui';
import { truncateMiddle } from '@stacks/ui-utils';
import { UserAreaSelectors } from '@tests-legacy/integration/user-area.selectors';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { Tooltip } from '@app/components/tooltip';
import { Caption } from '@app/components/typography';
import { CurrentAccountAvatar } from '@app/features/current-account/current-account-avatar';
import { CurrentAccountName } from '@app/features/current-account/current-account-name';
import { useCurrentAccountNamesQuery } from '@app/query/stacks/bns/bns.hooks';
import { useCurrentAccount } from '@app/store/accounts/account.hooks';

const AccountBnsAddress = memo(() => {
  const currentAccountNamesQuery = useCurrentAccountNamesQuery();

  const bnsName = currentAccountNamesQuery.data?.names[0];
  const { onCopy, hasCopied } = useClipboard(bnsName || '');
  const analytics = useAnalytics();
  const copyToClipboard = () => {
    void analytics.track('copy_address_to_clipboard');
    onCopy();
  };

  if (!bnsName) return null;

  return (
    <>
      <Caption>{bnsName}</Caption>
      <Tooltip placement="right" label={hasCopied ? 'Copied!' : 'Copy BNS name'}>
        <Stack>
          <Box
            _hover={{ cursor: 'pointer' }}
            onClick={copyToClipboard}
            size="12px"
            color={color('text-caption')}
            data-testid={UserAreaSelectors.AccountCopyBnsAddress}
            as={FiCopy}
          />
        </Stack>
      </Tooltip>
    </>
  );
});

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
  const currentAccount = useCurrentAccount();
  if (!currentAccount) return null;
  return (
    <Stack spacing="base-tight" alignItems="center" isInline {...props}>
      <CurrentAccountAvatar />
      <Stack overflow="hidden" display="block" alignItems="flex-start" spacing="base-tight">
        <CurrentAccountName />
        <Stack isInline>
          <AccountAddress />
          <AccountBnsAddress />
        </Stack>
      </Stack>
    </Stack>
  );
});
