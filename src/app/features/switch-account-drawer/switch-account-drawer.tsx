import { memo } from 'react';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useCreateAccount } from '@app/common/hooks/account/use-create-account';
import { ControlledDrawer } from '@app/components/drawer/controlled';
import {
  useAccounts,
  useCurrentAccountIndex,
  useHasCreatedAccount,
} from '@app/store/accounts/account.hooks';
import { useShowSwitchAccountsState } from '@app/store/ui/ui.hooks';

import { AccountList } from './components/account-list';
import { AccountListUnavailable } from './components/account-list-unavailable';
import { CreateAccountAction } from './components/create-account-action';

export const SwitchAccountDrawer = memo(() => {
  const [isShowing, setShowSwitchAccountsState] = useShowSwitchAccountsState();
  const accounts = useAccounts();
  const currentAccountIndex = useCurrentAccountIndex();
  const analytics = useAnalytics();
  const createAccount = useCreateAccount();
  const [, setHasCreatedAccount] = useHasCreatedAccount();

  const onClose = () => {
    setShowSwitchAccountsState(false);
  };

  const onCreateAccount = () => {
    void analytics.track('choose_to_create_account');
    void createAccount();
    setHasCreatedAccount(true);
    setShowSwitchAccountsState(false);
  };

  if (isShowing && !accounts) {
    void analytics.track('account_list_unavailable_warning_displayed');
    return <AccountListUnavailable />;
  }

  return isShowing && accounts ? (
    <ControlledDrawer title="Switch account" isShowing={isShowing} onClose={onClose}>
      <AccountList
        accounts={accounts}
        currentAccountIndex={currentAccountIndex}
        handleClose={onClose}
      />
      <CreateAccountAction onCreateAccount={onCreateAccount} />
    </ControlledDrawer>
  ) : null;
});
