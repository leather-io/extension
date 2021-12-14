import React, { memo } from 'react';
import { Box, Button } from '@stacks/ui';

import { useUpdateAccountDrawerStep } from '@store/ui/ui.hooks';
import { AccountStep } from '@store/ui/ui.models';
import { useAccounts } from '@store/accounts/account.hooks';
import { useAnalytics } from '@common/hooks/analytics/use-analytics';

import { AccountList } from './components/account-list';

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

  return (
    <>
      {accounts ? <AccountList accounts={accounts} handleClose={close} /> : null}
      <Box pt="base" pb="loose" px="loose">
        <Button onClick={setCreateAccountStep}>Create an account</Button>
      </Box>
    </>
  );
});
