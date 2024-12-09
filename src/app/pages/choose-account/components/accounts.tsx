import { Suspense, memo, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Virtuoso } from 'react-virtuoso';

import { Box, Flex, FlexProps, HStack, Stack, styled } from 'leather-styles/jsx';

import { PlusIcon, Pressable } from '@leather.io/ui';

import { RouteUrls } from '@shared/route-urls';

import { useFinishAuthRequest } from '@app/common/authentication/use-finish-auth-request';
import { useAccountDisplayName } from '@app/common/hooks/account/use-account-names';
import { useCreateAccount } from '@app/common/hooks/account/use-create-account';
import { useWalletType } from '@app/common/use-wallet-type';
import { slugify } from '@app/common/utils';
import { AccountTotalBalance } from '@app/components/account-total-balance';
import { AcccountAddresses } from '@app/components/account/account-addresses';
import { AccountListItemLayout } from '@app/components/account/account-list-item.layout';
import { useNativeSegwitAccountIndexAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useStacksAccounts } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { StacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.models';
import { AccountAvatar } from '@app/ui/components/account/account-avatar/account-avatar';

interface AccountTitlePlaceholderProps {
  account: StacksAccount;
}
function AccountTitlePlaceholder({ account }: AccountTitlePlaceholderProps) {
  const name = `Account ${account?.index + 1}`;
  return <styled.span>{name}</styled.span>;
}

interface ChooseAccountItemProps extends FlexProps {
  selectedAddress?: string | null;
  isLoading: boolean;
  account: StacksAccount;
  onSelectAccount(index: number): void;
}
const ChooseAccountItem = memo(
  ({ account, isLoading, onSelectAccount }: ChooseAccountItemProps) => {
    const { data: name = '' } = useAccountDisplayName(account);

    const btcAddress = useNativeSegwitAccountIndexAddressIndexZero(account.index);

    const accountSlug = useMemo(() => slugify(`Account ${account?.index + 1}`), [account?.index]);

    return (
      <AccountListItemLayout
        accountAddresses={<AcccountAddresses index={account.index} />}
        accountName={
          <Suspense fallback={<AccountTitlePlaceholder account={account} />}>
            <styled.span textStyle="label.01">{name}</styled.span>
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
        data-testid={`account-${accountSlug}-${account.index}`}
        index={account.index}
        isLoading={isLoading}
        isSelected={false}
        onSelectAccount={() => onSelectAccount(account.index)}
      />
    );
  }
);

function AddAccountAction() {
  const createAccount = useCreateAccount();

  return (
    <Flex mx="space.05">
      <Pressable onClick={createAccount} py="space.02">
        <HStack alignItems="center">
          <PlusIcon />
          <styled.span textStyle="label.02">Generate new account</styled.span>
        </HStack>
      </Pressable>
    </Flex>
  );
}

export function ChooseAccountsList() {
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
    <Stack width="100%" height="100%" mt="space.05">
      {whenWallet({ software: <AddAccountAction />, ledger: <></> })}

      <Box height="100%">
        <Virtuoso
          data={accounts}
          itemContent={(index, account) => (
            <Box key={index} my="space.05" px="space.05">
              <ChooseAccountItem
                account={account}
                isLoading={whenWallet({ software: selectedAccount === index, ledger: false })}
                onSelectAccount={signIntoAccount}
              />
            </Box>
          )}
        />
      </Box>
    </Stack>
  );
}
