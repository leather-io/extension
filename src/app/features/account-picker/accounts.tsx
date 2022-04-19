import { Suspense, memo, useMemo } from 'react';

import { FiPlusCircle } from 'react-icons/fi';
import { Virtuoso } from 'react-virtuoso';
import { Box, BoxProps, color, FlexProps, Spinner, Stack } from '@stacks/ui';
import { truncateMiddle } from '@stacks/ui-utils';

import { Caption, Text } from '@app/components/typography';
import { useAccountDisplayName } from '@app/common/hooks/account/use-account-names';

import { useOnboardingState } from '@app/common/hooks/auth/use-onboarding-state';
import { useCreateAccount } from '@app/common/hooks/account/use-create-account';
import { AccountAvatarWithName } from '@app/components/account-avatar/account-avatar';
import { SpaceBetween } from '@app/components/space-between';
import { usePressable } from '@app/components/item-hover';
import {
  AccountBalanceCaption,
  AccountBalanceLoading,
} from '@app/components/account-balance-caption';
import { slugify } from '@app/common/utils';
import { useAccounts, useHasCreatedAccount } from '@app/store/accounts/account.hooks';
import { useAddressBalances } from '@app/query/balance/balance.hooks';

import { AccountWithAddress } from '@app/store/accounts/account.models';
import { AccountTitle, AccountTitlePlaceholder } from '@app/components/account/account-title';
import { useWalletType } from '@app/common/use-wallet-type';

const loadingProps = { color: '#A1A7B3' };
const getLoadingProps = (loading: boolean) => (loading ? loadingProps : {});

interface AccountItemProps extends FlexProps {
  selectedAddress?: string | null;
  isLoading: boolean;
  account: AccountWithAddress;
  onSelectAccount(index: number): void;
}
const AccountItem = memo((props: AccountItemProps) => {
  const { selectedAddress, account, isLoading, onSelectAccount, ...rest } = props;
  const [component, bind] = usePressable(true);
  const { decodedAuthRequest } = useOnboardingState();
  const name = useAccountDisplayName(account);
  const { data: balances, isLoading: isBalanceLoading } = useAddressBalances(account.address);
  const showLoadingProps = !!selectedAddress || !decodedAuthRequest;

  const accountSlug = useMemo(() => slugify(`Account ${account?.index + 1}`), [account?.index]);

  return (
    <Box
      height="68px"
      data-testid={`account-${accountSlug}-${account.index}`}
      onClick={() => onSelectAccount(account.index)}
      {...rest}
    >
      <Box {...bind}>
        <Stack spacing="base" alignSelf="center" isInline>
          <AccountAvatarWithName name={name} flexGrow={0} publicKey={account.stxPublicKey} />
          <SpaceBetween width="100%" alignItems="center">
            <Stack textAlign="left" spacing="base-tight">
              <Suspense
                fallback={
                  <AccountTitlePlaceholder
                    {...getLoadingProps(showLoadingProps)}
                    account={account}
                  />
                }
              >
                <AccountTitle name={name} account={account} />
              </Suspense>
              <Stack alignItems="center" spacing="6px" isInline>
                <Caption fontSize={0} {...getLoadingProps(showLoadingProps)}>
                  {truncateMiddle(account.address, 4)}
                </Caption>
                {isBalanceLoading ? (
                  <AccountBalanceLoading />
                ) : (
                  balances && <AccountBalanceCaption availableBalance={balances.availableStx} />
                )}
              </Stack>
            </Stack>
            {isLoading && <Spinner width={4} height={4} {...loadingProps} />}
          </SpaceBetween>
        </Stack>
        {component}
      </Box>
    </Box>
  );
});

const AddAccountAction = memo(() => {
  const [component, bind] = usePressable(true);
  const createAccount = useCreateAccount();
  const [, setHasCreatedAccount] = useHasCreatedAccount();

  const onCreateAccount = () => {
    createAccount();
    setHasCreatedAccount(true);
  };

  return (
    <Box mb="loose" px="base-tight" py="tight" onClick={onCreateAccount} {...bind}>
      <Stack isInline alignItems="center" color={color('text-body')}>
        <Box size="16px" as={FiPlusCircle} color={color('brand')} />
        <Text color="currentColor">Generate new account</Text>
      </Stack>
      {component}
    </Box>
  );
});

interface AccountPickerProps {
  selectedAccountIndex: number | null;
  onAccountSelected(index: number): void;
}
export function AccountPicker(props: AccountPickerProps) {
  const { onAccountSelected, selectedAccountIndex } = props;
  const { whenWallet } = useWalletType();

  const accounts = useAccounts();

  //   const { finishSignIn } = useWallet();
  // const accounts = useAccounts();
  // const navigate = useNavigate();

  // const signIntoAccount = async (index: number) => {
  //   setSelectedAccount(index);
  //   await whenWallet({
  //     async software() {
  //       await finishSignIn(index);
  //     },
  //     async ledger() {
  //       navigate(RouteUrls.ConnectLedger, { state: { index } });
  //     },
  //   })();
  // };

  // if (!accounts) return null;

  return (
    <Box mt="loose" width="100%">
      {whenWallet({ software: <AddAccountAction />, ledger: <></> })}
      <Virtuoso
        useWindowScroll
        data={accounts}
        style={{ height: '68px' }}
        itemContent={(index, account) => (
          <AccountItem
            account={account}
            isLoading={whenWallet({ software: selectedAccountIndex === index, ledger: false })}
            onSelectAccount={onAccountSelected}
          />
        )}
      />
    </Box>
  );
}
