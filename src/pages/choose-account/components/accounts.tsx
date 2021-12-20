import { useCallback, Suspense, memo } from 'react';
import { FiPlusCircle } from 'react-icons/fi';
import { Box, BoxProps, color, FlexProps, Spinner, Stack } from '@stacks/ui';
import { Caption, Text, Title } from '@components/typography';

import { useAccountDisplayName } from '@common/hooks/account/use-account-names';
import { useWallet } from '@common/hooks/use-wallet';
import { truncateMiddle } from '@stacks/ui-utils';
import { useOnboardingState } from '@common/hooks/auth/use-onboarding-state';

import type { AccountWithAddress } from '@store/accounts/account.models';
import { AccountAvatarWithName } from '@components/account-avatar/account-avatar';
import { SpaceBetween } from '@components/space-between';

import { usePressable } from '@components/item-hover';

import { useLoading } from '@common/hooks/use-loading';
import { AccountBalanceCaption } from '@components/account-balance-caption';
import { slugify } from '@common/utils';
import { useAccounts } from '@store/accounts/account.hooks';
import { useUpdateAccountDrawerStep, useUpdateShowAccounts } from '@store/ui/ui.hooks';
import { AccountStep } from '@store/ui/ui.models';
import { useAddressAvailableStxBalance } from '@query/balance/balance.hooks';

const loadingProps = { color: '#A1A7B3' };
const getLoadingProps = (loading: boolean) => (loading ? loadingProps : {});

interface AccountItemProps extends FlexProps {
  selectedAddress?: string | null;
  account: AccountWithAddress;
}

const AccountTitlePlaceholder = ({
  account,
  ...rest
}: { account: AccountWithAddress } & BoxProps) => {
  const name = `Account ${account?.index + 1}`;
  return (
    <Title fontSize={2} lineHeight="1rem" fontWeight="400" {...rest}>
      {name}
    </Title>
  );
};

const AccountTitle = ({ account, ...rest }: { account: AccountWithAddress } & BoxProps) => {
  const name = useAccountDisplayName(account);
  return (
    <Title fontSize={2} lineHeight="1rem" fontWeight="400" {...rest}>
      {name}
    </Title>
  );
};

const AccountItem = ({ selectedAddress, account, ...rest }: AccountItemProps) => {
  const [component, bind] = usePressable(true);
  const { isLoading, setIsLoading } = useLoading(`CHOOSE_ACCOUNT__${account.address}`);
  const { finishSignIn } = useWallet();
  const { decodedAuthRequest } = useOnboardingState();
  const name = useAccountDisplayName(account);
  const availableStxBalance = useAddressAvailableStxBalance(account.address);
  const showLoadingProps = !!selectedAddress || !decodedAuthRequest;

  const handleOnClick = useCallback(async () => {
    setIsLoading();
    await finishSignIn(account.index);
  }, [setIsLoading, finishSignIn, account]);

  const accountSlug = slugify(`Account ${account?.index + 1}`);

  return (
    <Box
      data-testid={`account-${accountSlug}-${account.index}`}
      onClick={() => handleOnClick()}
      {...bind}
      {...rest}
    >
      <Stack spacing="base" isInline>
        <AccountAvatarWithName name={name} flexGrow={0} account={account} />
        <SpaceBetween width="100%" alignItems="center">
          <Stack textAlign="left" spacing="base-tight">
            <Suspense
              fallback={
                <AccountTitlePlaceholder {...getLoadingProps(showLoadingProps)} account={account} />
              }
            >
              <AccountTitle {...getLoadingProps(showLoadingProps)} account={account} />
            </Suspense>
            <Stack alignItems="center" spacing="6px" isInline>
              <Caption fontSize={0} {...getLoadingProps(showLoadingProps)}>
                {truncateMiddle(account.address, 4)}
              </Caption>
              <Suspense fallback={<></>}>
                <AccountBalanceCaption availableBalance={availableStxBalance} />
              </Suspense>
            </Stack>
          </Stack>
          {isLoading && <Spinner width={4} height={4} {...loadingProps} />}
        </SpaceBetween>
      </Stack>
      {component}
    </Box>
  );
};

const AddAccountAction = memo(() => {
  const setAccounts = useUpdateShowAccounts();
  const setAccountDrawerStep = useUpdateAccountDrawerStep();
  const [component, bind] = usePressable(true);

  return (
    <Box
      px="base-tight"
      py="tight"
      onClick={() => {
        setAccounts(true);
        setAccountDrawerStep(AccountStep.Create);
      }}
      {...bind}
    >
      <Stack isInline alignItems="center" color={color('text-body')}>
        <Box size="16px" as={FiPlusCircle} color={color('brand')} />
        <Text color="currentColor">Generate new account</Text>
      </Stack>
      {component}
    </Box>
  );
});

interface AccountsProps extends FlexProps {
  accountIndex?: number;
  showAddAccount?: boolean;
  next?: (accountIndex: number) => void;
}

export const Accounts = memo(({ showAddAccount, accountIndex, next, ...rest }: AccountsProps) => {
  const { wallet } = useWallet();
  const accounts = useAccounts();
  const { decodedAuthRequest } = useOnboardingState();

  if (!wallet || !accounts || !decodedAuthRequest) return null;

  return (
    <>
      <Stack spacing="loose" {...rest}>
        {accounts.map(account => (
          <AccountItem key={account.address} account={account} />
        ))}
        <AddAccountAction />
      </Stack>
    </>
  );
});
