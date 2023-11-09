import { Suspense, memo, useMemo, useState } from 'react';
import { FiPlusCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Virtuoso } from 'react-virtuoso';

import { Box, FlexProps, HStack, styled } from 'leather-styles/jsx';

import { RouteUrls } from '@shared/route-urls';

import { useFinishAuthRequest } from '@app/common/authentication/use-finish-auth-request';
import { useAccountDisplayName } from '@app/common/hooks/account/use-account-names';
import { useCreateAccount } from '@app/common/hooks/account/use-create-account';
import { useOnboardingState } from '@app/common/hooks/auth/use-onboarding-state';
import { useWalletType } from '@app/common/use-wallet-type';
import { slugify } from '@app/common/utils';
import { AccountTotalBalance } from '@app/components/account-total-balance';
import { AccountAvatar } from '@app/components/account/account-avatar/account-avatar';
import { AccountListItemLayout } from '@app/components/account/account-list-item-layout';
import { usePressable } from '@app/components/item-hover';
import { useNativeSegwitAccountIndexAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useStacksAccounts } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { StacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.models';

// #4476 TODO - test / refactor this - I'm not sure what it does
// seems like it makes the account title a different colour when loading
// I re-wrote this as it was way over complicated but not sure if its needed
// - changes color based on whether its loading or not
// const loadingProps = { color: '#A1A7B3' };
// const getLoadingProps = (loading: boolean) => (loading ? loadingProps : {});

interface AccountTitlePlaceholderProps {
  account: StacksAccount;
  loading?: boolean;
}
function AccountTitlePlaceholder({ account, loading }: AccountTitlePlaceholderProps) {
  const name = `Account ${account?.index + 1}`;
  return <styled.span color={loading ? 'red' : undefined}>{name}</styled.span>;
}

interface AccountTitleProps {
  account: StacksAccount;
  name: string;
  loading?: boolean;
}
function AccountTitle({ name, loading }: AccountTitleProps) {
  return (
    <styled.span textStyle="label.01" color={loading ? 'red' : undefined}>
      {name}
    </styled.span>
  );
}

interface ChooseAccountItemProps extends FlexProps {
  selectedAddress?: string | null;
  isLoading: boolean;
  account: StacksAccount;
  onSelectAccount(index: number): void;
}
const ChooseAccountItem = memo(
  ({ selectedAddress, account, isLoading, onSelectAccount }: ChooseAccountItemProps) => {
    const [component, bind] = usePressable(true);
    const { decodedAuthRequest } = useOnboardingState();
    const name = useAccountDisplayName(account);
    const btcAddress = useNativeSegwitAccountIndexAddressIndexZero(account.index);

    const showLoadingProps = !!selectedAddress || !decodedAuthRequest;
    const accountSlug = useMemo(() => slugify(`Account ${account?.index + 1}`), [account?.index]);

    return (
      // Padding required on outer element to prevent jumpy list behaviours in
      // virtualised list library
      <Box pb="space.05">
        <AccountListItemLayout
          index={account.index}
          isActive={false}
          accountName={
            <Suspense
              fallback={<AccountTitlePlaceholder account={account} loading={showLoadingProps} />}
            >
              <AccountTitle name={name} account={account} loading={showLoadingProps} />
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
            <AccountTotalBalance stxAddress={account.address} btcAddress={btcAddress} />
          }
          isLoading={isLoading}
          onSelectAccount={() => onSelectAccount(account.index)}
          data-testid={`account-${accountSlug}-${account.index}`}
          {...bind}
        >
          {component}
        </AccountListItemLayout>
      </Box>
    );
  }
);

const AddAccountAction = memo(() => {
  const [component, bind] = usePressable(true);
  const createAccount = useCreateAccount();

  const onCreateAccount = () => {
    createAccount();
  };

  return (
    <Box mb="loose" px="base-tight" py="tight" onClick={onCreateAccount} {...bind}>
      <HStack alignItems="center">
        <FiPlusCircle size="16px" />
        {/* 
        #4476 TODO - test / refactor this - I'm not sure where it is or what it does 
        We have a button instead for `Create new account'
        */}
        Generate new account
      </HStack>
      {component}
    </Box>
  );
});

export const ChooseAccountsList = memo(() => {
  const finishSignIn = useFinishAuthRequest();
  const { whenWallet } = useWalletType();
  const accounts = useStacksAccounts();
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
