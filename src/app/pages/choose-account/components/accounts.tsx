import { Suspense, memo, useMemo, useState } from 'react';
import { FiPlusCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Virtuoso } from 'react-virtuoso';

import { Box, BoxProps, FlexProps, Stack, Text, color } from '@stacks/ui';

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
import { Title } from '@app/components/typography';
import { useHasCreatedAccount } from '@app/store/accounts/account';
import { useNativeSegwitAccountIndexAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useStacksAccounts } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { StacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.models';

const loadingProps = { color: '#A1A7B3' };
const getLoadingProps = (loading: boolean) => (loading ? loadingProps : {});

interface AccountTitlePlaceholderProps extends BoxProps {
  account: StacksAccount;
}
function AccountTitlePlaceholder({ account, ...rest }: AccountTitlePlaceholderProps) {
  const name = `Account ${account?.index + 1}`;
  return (
    <Title fontSize={2} lineHeight="1rem" fontWeight="400" {...rest}>
      {name}
    </Title>
  );
}

interface AccountTitleProps extends BoxProps {
  account: StacksAccount;
  name: string;
}
function AccountTitle({ account, name, ...rest }: AccountTitleProps) {
  return (
    <Title fontSize={2} lineHeight="1rem" fontWeight="400" {...rest}>
      {name}
    </Title>
  );
}

interface ChooseAccountItemProps extends FlexProps {
  selectedAddress?: string | null;
  isLoading: boolean;
  account: StacksAccount;
  onSelectAccount(index: number): void;
}
const ChooseAccountItem = memo((props: ChooseAccountItemProps) => {
  const { selectedAddress, account, isLoading, onSelectAccount, ...rest } = props;
  const [component, bind] = usePressable(true);
  const { decodedAuthRequest } = useOnboardingState();
  const name = useAccountDisplayName(account);
  const btcAddress = useNativeSegwitAccountIndexAddressIndexZero(account.index);

  const showLoadingProps = !!selectedAddress || !decodedAuthRequest;

  const accountSlug = useMemo(() => slugify(`Account ${account?.index + 1}`), [account?.index]);

  return (
    // Padding required on outer element to prevent jumpy list behaviours in
    // virtualised list library
    <Box pb="loose">
      <AccountListItemLayout
        stxAddress={account.address}
        btcAddress={btcAddress}
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
        balanceLabel={<AccountTotalBalance stxAddress={account.address} btcAddress={btcAddress} />}
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
