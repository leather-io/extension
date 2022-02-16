import { memo } from 'react';
import { Box } from '@stacks/ui';

import { useUpdateAccountDrawerStep } from '@app/store/ui/ui.hooks';
import { AccountStep } from '@app/store/ui/ui.models';
import { useAccounts, useCurrentAccountIndex } from '@app/store/accounts/account.hooks';
import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';

import { AccountList } from './components/account-list';
import { AccountListUnavailable } from './components/account-list-unavailable';
import { CreateAccountAction } from './components/create-account-action';
import { useWalletType } from '@app/common/use-wallet-type';

interface SwitchAccountProps {
  close(): void;
}
export const SwitchAccounts = memo(({ close }: SwitchAccountProps) => {
  const setAccountDrawerStep = useUpdateAccountDrawerStep();
  const accounts = useAccounts();
  const currentAccountIndex = useCurrentAccountIndex();
  const analytics = useAnalytics();
  const { whenWallet } = useWalletType();

  const setCreateAccountStep = () => {
    void analytics.track('choose_to_create_account');
    setAccountDrawerStep(AccountStep.Create);
  };

  if (!accounts) {
    void analytics.track('account_list_unavailable_warning_displayed');
    return <AccountListUnavailable />;
  }

  return (
    <Box mb={whenWallet({ ledger: 'base', software: '' })}>
      <AccountList
        accounts={accounts}
        currentAccountIndex={currentAccountIndex}
        handleClose={close}
      />
      {whenWallet({
        software: <CreateAccountAction onCreateAccount={() => setCreateAccountStep()} />,
        ledger: <></>,
      })}
    </Box>
  );
});
