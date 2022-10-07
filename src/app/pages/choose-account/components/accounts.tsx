import { Suspense, memo, useState, useMemo } from 'react';
import { FiPlusCircle } from 'react-icons/fi';
import { Virtuoso } from 'react-virtuoso';
import { Box, BoxProps, color, FlexProps, Stack } from '@stacks/ui';

import { Text, Title } from '@app/components/typography';
import { useAccountDisplayName } from '@app/common/hooks/account/use-account-names';
import { useWallet } from '@app/common/hooks/use-wallet';
import { useOnboardingState } from '@app/common/hooks/auth/use-onboarding-state';
import { useCreateAccount } from '@app/common/hooks/account/use-create-account';
import { AccountAvatarWithName } from '@app/components/account/account-avatar/account-avatar';

import { usePressable } from '@app/components/item-hover';
import {
  AccountBalanceCaption,
  AccountBalanceLoading,
} from '@app/components/account/account-balance-caption';
import { slugify } from '@app/common/utils';
import { useAccounts, useHasCreatedAccount } from '@app/store/accounts/account.hooks';
import { useAddressBalances } from '@app/query/stacks/balance/balance.hooks';
import { useWalletType } from '@app/common/use-wallet-type';
import { AccountWithAddress } from '@app/store/accounts/account.models';
import { useNavigate } from 'react-router-dom';
import { RouteUrls } from '@shared/route-urls';
import { AccountListItemLayout } from '@app/components/account/account-list-item-layout';

const loadingProps = { color: '#A1A7B3' };
const getLoadingProps = (loading: boolean) => (loading ? loadingProps : {});

interface AccountTitlePlaceholderProps extends BoxProps {
  account: AccountWithAddress;
}
const AccountTitlePlaceholder = ({ account, ...rest }: AccountTitlePlaceholderProps) => {
  const name = `Account ${account?.index + 1}`;
  return (
    <Title fontSize={2} lineHeight="1rem" fontWeight="400" {...rest}>
      {name}
    </Title>
  );
};

interface AccountTitleProps extends BoxProps {
  account: AccountWithAddress;
  name: string;
}
const AccountTitle = ({ account, name, ...rest }: AccountTitleProps) => {
  return (
    <Title fontSize={2} lineHeight="1rem" fontWeight="400" {...rest}>
      {name}
    </Title>
  );
};

interface ChooseAccountItemProps extends FlexProps {
  selectedAddress?: string | null;
  isLoading: boolean;
  account: AccountWithAddress;
  onSelectAccount(index: number): void;
}
const ChooseAccountItem = memo((props: ChooseAccountItemProps) => {
  const { selectedAddress, account, isLoading, onSelectAccount, ...rest } = props;
  const [component, bind] = usePressable(true);
  const { decodedAuthRequest } = useOnboardingState();
  const name = useAccountDisplayName(account);
  const { data: balances, isLoading: isBalanceLoading } = useAddressBalances(account.address);
  const showLoadingProps = !!selectedAddress || !decodedAuthRequest;

  const accountSlug = useMemo(() => slugify(`Account ${account?.index + 1}`), [account?.index]);

  return (
    <AccountListItemLayout
      account={account}
      accountName={
        <Suspense
          fallback={
            <AccountTitlePlaceholder {...getLoadingProps(showLoadingProps)} account={account} />
          }
        >
          <AccountTitle name={name} {...getLoadingProps(showLoadingProps)} account={account} />
        </Suspense>
      }
      avatar={<AccountAvatarWithName name={name} flexGrow={0} publicKey={account.stxPublicKey} />}
      balanceLabel={
        isBalanceLoading ? (
          <AccountBalanceLoading />
        ) : balances ? (
          <AccountBalanceCaption availableBalance={balances.availableStx} />
        ) : (
          <></>
        )
      }
      isLoading={isLoading}
      onSelectAccount={() => onSelectAccount(account.index)}
      data-testid={`account-${accountSlug}-${account.index}`}
      mb="loose"
      {...bind}
      {...rest}
    >
      {component}
    </AccountListItemLayout>
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

export const ChooseAccountsList = memo(() => {
  const { finishSignIn } = useWallet();
  const { whenWallet } = useWalletType();
  const accounts = useAccounts();
  const navigate = useNavigate();
  const [selectedAccount, setSelectedAccount] = useState<number | null>(null);

  const signIntoAccount = async (index: number) => {
    setSelectedAccount(index);
    await whenWallet({
      async software() {
        await finishSignIn(index);
      },
      async ledger() {
        navigate(RouteUrls.ConnectLedger, { state: { index } });
      },
    })();
  };

  if (!accounts) return null;

  return (
    <Box mt="loose" width="100%">
      {whenWallet({ software: <AddAccountAction />, ledger: <></> })}
      <Virtuoso
        useWindowScroll
        data={accounts}
        style={{ height: '68px' }}
        itemContent={(index, account) => (
          <ChooseAccountItem
            account={account}
            isLoading={whenWallet({ software: selectedAccount === index, ledger: false })}
            onSelectAccount={signIntoAccount}
          />
        )}
      />
    </Box>
  );
});
