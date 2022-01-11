import React, { memo, useCallback } from 'react';
import { truncateMiddle } from '@stacks/ui-utils';
import { Box, Fade, Stack, color, Spinner } from '@stacks/ui';
import { FiCheck as IconCheck } from 'react-icons/fi';

import { SpaceBetween } from '@components/space-between';
import { useSwitchAccount } from '@common/hooks/account/use-switch-account';
import { useLoading } from '@common/hooks/use-loading';
import { SettingsSelectors } from '@tests/integration/settings.selectors';
import { AccountBalanceCaption } from '@components/account-balance-caption';
import { useAccountAvailableStxBalance } from '@store/accounts/account.hooks';
import { AccountWithAddress } from '@store/accounts/account.models';
import { Caption } from '@components/typography';
import { AccountAvatarItem } from './account-avatar';
import { AccountName } from './account-name';

const AccountListItem = memo(
  ({ account, handleClose }: { account: AccountWithAddress; handleClose: () => void }) => {
    const { isLoading, setIsLoading, setIsIdle } = useLoading('SWITCH_ACCOUNTS' + account.address);
    const availableStxBalance = useAccountAvailableStxBalance(account.address);
    const { handleSwitchAccount, getIsActive } = useSwitchAccount(handleClose);
    const handleClick = useCallback(async () => {
      setIsLoading();
      setTimeout(async () => {
        await handleSwitchAccount(account.index);
        setIsIdle();
      }, 80);
    }, [setIsLoading, setIsIdle, account.index, handleSwitchAccount]);
    return (
      <SpaceBetween
        width="100%"
        key={`account-${account.index}`}
        data-testid={SettingsSelectors.AccountIndex.replace('[index]', `${account.index}`)}
        _hover={{
          bg: color('bg-4'),
        }}
        cursor="pointer"
        py="base"
        px="extra-loose"
        onClick={handleClick}
        position="relative"
      >
        <Stack isInline alignItems="center" spacing="base">
          <AccountAvatarItem account={account} />
          <Stack spacing="base-tight">
            <AccountName account={account} />
            <Stack alignItems="center" spacing="6px" isInline>
              <Caption>{truncateMiddle(account.address, 4)}</Caption>
              <React.Suspense fallback={<></>}>
                <AccountBalanceCaption availableBalance={availableStxBalance} />
              </React.Suspense>
            </Stack>
          </Stack>
        </Stack>
        <Fade in={isLoading}>
          {styles => (
            <Spinner
              position="absolute"
              right="loose"
              color={color('text-caption')}
              size="18px"
              style={styles}
            />
          )}
        </Fade>
        <Fade in={getIsActive(account.index)}>
          {styles => (
            <Box
              as={IconCheck}
              size="18px"
              strokeWidth={2.5}
              color={color('brand')}
              style={styles}
              data-testid={`account-checked-${account.index}`}
            />
          )}
        </Fade>
      </SpaceBetween>
    );
  }
);

interface AccountListProps {
  handleClose: () => void;
  accounts: AccountWithAddress[];
}
export const AccountList = memo(({ accounts, handleClose }: AccountListProps) => {
  return (
    <>
      {accounts.map(account => (
        <AccountListItem handleClose={handleClose} key={account.address} account={account} />
      ))}
    </>
  );
});
