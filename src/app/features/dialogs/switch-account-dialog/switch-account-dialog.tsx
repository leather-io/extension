import { memo } from 'react';
import { Virtuoso } from 'react-virtuoso';

import { Button, Dialog, DialogHeader, Footer, VirtuosoWrapper } from '@leather-wallet/ui';
import { Box } from 'leather-styles/jsx';

import { useCreateAccount } from '@app/common/hooks/account/use-create-account';
import { useWalletType } from '@app/common/use-wallet-type';
import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { useFilteredBitcoinAccounts } from '@app/store/accounts/blockchain/bitcoin/bitcoin.ledger';
import { useStacksAccounts } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { AccountListUnavailable } from './components/account-list-unavailable';
import { SwitchAccountListItem } from './components/switch-account-list-item';

export interface SwitchAccountOutletContext {
  isShowingSwitchAccount: boolean;
  setIsShowingSwitchAccount(isShowing: boolean): void;
}

interface SwitchAccountDialogProps {
  isShowing: boolean;
  onClose(): void;
}

export const SwitchAccountDialog = memo(({ isShowing, onClose }: SwitchAccountDialogProps) => {
  const currentAccountIndex = useCurrentAccountIndex();
  const createAccount = useCreateAccount();
  const { whenWallet } = useWalletType();
  const stacksAccounts = useStacksAccounts();
  const bitcoinAccounts = useFilteredBitcoinAccounts();
  const btcAddressesNum = bitcoinAccounts.length / 2;
  const stacksAddressesNum = stacksAccounts.length;

  const onCreateAccount = () => {
    createAccount();
    onClose();
  };

  if (isShowing && stacksAddressesNum === 0 && btcAddressesNum === 0) {
    return <AccountListUnavailable />;
  }
  // #4370 SMELL without this early return the wallet crashes on new install with
  // : Wallet is neither of type `ledger` nor `software`
  // FIXME remove this when adding Create Account to Ledger in #2502 #4983
  if (!isShowing) return null;

  const accountNum = stacksAddressesNum || btcAddressesNum;

  return (
    <Dialog
      header={<DialogHeader title="Select account" />}
      isShowing={isShowing}
      onClose={onClose}
      wrapChildren={false}
      footer={whenWallet({
        software: (
          <Footer>
            <Button fullWidth onClick={() => onCreateAccount()}>
              Create new account
            </Button>
          </Footer>
        ),
        ledger: null,
      })}
    >
      <VirtuosoWrapper hasFooter={whenWallet({ ledger: false, software: true })}>
        <Virtuoso
          style={{
            height: '100%',
          }}
          initialTopMostItemIndex={whenWallet({ ledger: 0, software: currentAccountIndex })}
          totalCount={accountNum}
          itemContent={index => (
            <Box key={index} my="space.05" px="space.05">
              <SwitchAccountListItem
                handleClose={onClose}
                currentAccountIndex={currentAccountIndex}
                index={index}
              />
            </Box>
          )}
        />
      </VirtuosoWrapper>
    </Dialog>
  );
});
