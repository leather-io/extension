import { Suspense, memo, useMemo, useState } from 'react';
import { FiPlusCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Virtuoso } from 'react-virtuoso';

import { Box, BoxProps, FlexProps, Stack, Text, color } from '@stacks/ui';

import { RouteUrls } from '@shared/route-urls';

import { useAccountDisplayName } from '@app/common/hooks/account/use-account-names';
import { useCreateAccount } from '@app/common/hooks/account/use-create-account';
import { useOnboardingState } from '@app/common/hooks/auth/use-onboarding-state';
import { useWallet } from '@app/common/hooks/use-wallet';
import { useWalletType } from '@app/common/use-wallet-type';
import { slugify } from '@app/common/utils';
import { AccountAvatar } from '@app/components/account/account-avatar/account-avatar';
import {
  AccountBalanceCaption,
  AccountBalanceLoading,
} from '@app/components/account/account-balance-caption';
import { AccountListItemLayout } from '@app/components/account/account-list-item-layout';
import { usePressable } from '@app/components/item-hover';
import { Title } from '@app/components/typography';
import { useCryptoCurrencyMarketData } from '@app/query/common/market-data/market-data.hooks';
import { useAnchoredStacksAccountBalances } from '@app/query/stacks/balance/balance.hooks';
import { useAccounts, useHasCreatedAccount } from '@app/store/accounts/account.hooks';
import { AccountWithAddress } from '@app/store/accounts/account.models';

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
  const { data: balances, isLoading: isBalanceLoading } = useAnchoredStacksAccountBalances(
    account.address
  );
  const stxMarketData = useCryptoCurrencyMarketData('STX');

  const showLoadingProps = !!selectedAddress || !decodedAuthRequest;

  const accountSlug = useMemo(() => slugify(`Account ${account?.index + 1}`), [account?.index]);

  return (
    // Padding required on outer element to prevent jumpy list behaviours in
    // virtualised list library
    <Box pb="loose">
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
        avatar={
          <AccountAvatar
            index={account.index}
            publicKey={account.stxPublicKey}
            name={name}
            flexGrow={0}
          />
        }
        balanceLabel={
          isBalanceLoading ? (
            <AccountBalanceLoading />
          ) : balances ? (
            <AccountBalanceCaption
              availableBalance={balances.stx.availableStx}
              marketData={stxMarketData}
            />
          ) : (
            <></>
          )
        }
        isLoading={isLoading}
        onSelectAccount={() => onSelectAccount(account.index)}
        data-testid={`account-${accountSlug}-${account.index}`}
        {...bind}
        {...rest}
      >
        {component}
      </AccountListItemLayout>
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
