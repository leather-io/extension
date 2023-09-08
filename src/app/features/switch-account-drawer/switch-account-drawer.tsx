import { memo } from 'react';

import { Box } from 'leather-styles/jsx';

import { useCreateAccount } from '@app/common/hooks/account/use-create-account';
import { useWalletType } from '@app/common/use-wallet-type';
import { ControlledDrawer } from '@app/components/drawer/controlled-drawer';
import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { useStacksAccounts } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useShowSwitchAccountsState } from '@app/store/ui/ui.hooks';

import { AccountListUnavailable } from './components/account-list-unavailable';
import { CreateAccountAction } from './components/create-account-action';
import { SwitchAccountList } from './components/switch-account-list';

export const SwitchAccountDrawer = memo(() => {
  const [isShowing, setShowSwitchAccountsState] = useShowSwitchAccountsState();
  const accounts = useStacksAccounts();
  const currentAccountIndex = useCurrentAccountIndex();
  const createAccount = useCreateAccount();
  const { whenWallet } = useWalletType();

  const onClose = () => setShowSwitchAccountsState(false);

  const onCreateAccount = () => {
    createAccount();
    setShowSwitchAccountsState(false);
  };

  if (isShowing && !accounts) {
    return <AccountListUnavailable />;
  }

  return isShowing && accounts ? (
    <ControlledDrawer title="Select account" isShowing={isShowing} onClose={onClose}>
      <Box mb={whenWallet({ ledger: 'space.04', software: '' })}>
        <SwitchAccountList
          accounts={accounts}
          currentAccountIndex={currentAccountIndex}
          handleClose={onClose}
        />
        {whenWallet({
          software: <CreateAccountAction onCreateAccount={onCreateAccount} />,
          ledger: <></>,
        })}
      </Box>
    </ControlledDrawer>
  ) : null;
});
