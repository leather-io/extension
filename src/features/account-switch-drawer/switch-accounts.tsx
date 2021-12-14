import React, { memo } from 'react';

import { useUpdateAccountDrawerStep } from '@store/ui/ui.hooks';
import { AccountStep } from '@store/ui/ui.models';
import { useAccounts } from '@store/accounts/account.hooks';
import { useAnalytics } from '@common/hooks/analytics/use-analytics';

import { AccountList } from './components/account-list';
import { AccountListUnavailable } from './components/account-list-unavailable';
import { CreateAccountAction } from './components/create-account-action';

interface SwitchAccountProps {
  close(): void;
}
export const SwitchAccounts = memo(({ close }: SwitchAccountProps) => {
  const setAccountDrawerStep = useUpdateAccountDrawerStep();
  const accounts = useAccounts();
  const analytics = useAnalytics();

  const setCreateAccountStep = () => {
    void analytics.track('choose_to_create_account');
    setAccountDrawerStep(AccountStep.Create);
  };

  if (!accounts) {
    void analytics.track('account_list_unavailable_warning_displayed');
    return <AccountListUnavailable />;
  }

  return (
    <>
      <AccountList accounts={accounts} handleClose={close} />
      <CreateAccountAction onCreateAccount={() => setCreateAccountStep()} />
    </>
  );
});
